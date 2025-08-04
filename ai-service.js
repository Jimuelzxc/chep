// AI Service for handling different AI providers
class AIService {
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
    }

    async sendMessage(transcript, message, history = [], isMiniAssistant = false) {
        const provider = this.settingsManager.get('aiProvider');

        switch (provider) {
            case 'openai':
                return this.sendOpenAIMessage(transcript, message, history, isMiniAssistant);
            case 'gemini':
                return this.sendGeminiMessage(transcript, message, history, isMiniAssistant);
            case 'openrouter':
                return this.sendOpenRouterMessage(transcript, message, history, isMiniAssistant);
            default:
                throw new Error(`Unsupported AI provider: ${provider}`);
        }
    }

    extractTimestamps(transcript) {
        const timestampPattern = /\b(\d{1,2}:\d{2}(?::\d{2})?)\b/g;
        const timestamps = [...transcript.matchAll(timestampPattern)]
            .map(match => match[1])
            .filter(timestamp => {
                // Validate timestamp format
                const parts = timestamp.split(':').map(Number);
                if (parts.length === 3) { // HH:MM:SS
                    return parts[0] >= 0 && parts[1] < 60 && parts[2] < 60;
                } else if (parts.length === 2) { // MM:SS
                    return parts[0] >= 0 && parts[1] < 60;
                }
                return false;
            });

        // Remove duplicates and sort chronologically
        return [...new Set(timestamps)].sort((a, b) => {
            const aSeconds = this.timestampToSeconds(a);
            const bSeconds = this.timestampToSeconds(b);
            return aSeconds - bSeconds;
        });
    }

    timestampToSeconds(timestamp) {
        const parts = timestamp.split(':').map(Number);
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        }
        return 0;
    }

    buildSystemPrompt(transcript, isMiniAssistant = false) {
        const customPrompt = this.settingsManager.get('customPrompt');
        const hasTranscript = transcript && transcript.trim().length > 0;

        if (isMiniAssistant) {
            // Mini assistant mode - no timestamps, more concise
            let systemPrompt = `You are a helpful AI assistant.

Your job is to:
- **Answer questions concisely and accurately** using the provided context and general knowledge.
- **Be brief and to the point** - this is a quick assistance interface.
- **Do not include timestamps or time references** in your responses.
- **Focus on direct, helpful answers** without lengthy explanations unless specifically requested.`;

            if (customPrompt && customPrompt.trim()) {
                systemPrompt += `\n\nAdditional behavior instructions: ${customPrompt.trim()}`;
            }
            if (hasTranscript) {
                systemPrompt += `\n\nContext:\n---\n${transcript}\n---`;
            }
            return systemPrompt;
        }

        // Regular mode
        if (hasTranscript) {
            const availableTimestamps = this.extractTimestamps(transcript);
            const hasTimestamps = availableTimestamps.length > 0;

            let systemPrompt = `You are a helpful YouTube video assistant.

Your inputs are:
1. The full transcript of the video (below, enclosed in triple dashes).
2. The user's question about that video.

Your job is to:
- **Answer the question concisely and accurately**, prioritizing information found in the transcript, but also using general knowledge when appropriate.
- **Maintain conversation context** by referring to previous exchanges when relevant.`;

            if (hasTimestamps) {
                systemPrompt += `
- **Cite evidence with timestamps** by quoting relevant text and including the exact timestamp from the transcript. Format timestamps as clickable links like this: [0:45] or [1:23:45].
- **Only use timestamps that actually exist in the transcript** - available timestamps include: ${availableTimestamps.slice(0, 10).join(', ')}${availableTimestamps.length > 10 ? '...' : ''}
- **Provide context for timestamps** by briefly describing what happens at that moment in the video.
- **For each key point, provide a single, precise timestamp at the beginning of the point.**
- **The timestamp must correspond to the exact moment *before* the speaker begins discussing the idea.**
- **Format: [HH:MM:SS] Idea text...**
- **CRITICAL: Do NOT use timestamp ranges. Do NOT place timestamps in the middle or at the end of a sentence.**`;
            } else {
                systemPrompt += `
- **Quote relevant sections** from the transcript to support your answers, but note that this transcript doesn't include timestamps.`;
            }

            systemPrompt += `
- If the transcript does not contain the information needed, say so and explain why.
- Never invent or hallucinate any facts. Do not make up timestamps.
- When referencing multiple parts of the video, organize your response chronologically when possible.`;

            if (customPrompt && customPrompt.trim()) {
                systemPrompt += `\n\nAdditional behavior instructions: ${customPrompt.trim()}`;
            }

            systemPrompt += `\n\nTranscript:
---
${transcript}
---`;
            return systemPrompt;

        } else {
            // No transcript provided, use a generic prompt
            let systemPrompt = `You are a helpful AI assistant. Your job is to answer questions accurately and concisely based on your general knowledge.`;
            if (customPrompt && customPrompt.trim()) {
                systemPrompt += `\n\nAdditional behavior instructions: ${customPrompt.trim()}`;
            }
            return systemPrompt;
        }
    }

    async sendOpenAIMessage(transcript, message, history, isMiniAssistant = false) {
        const apiKey = this.settingsManager.get('openaiApiKey');
        const model = this.settingsManager.get('openaiModel');

        if (!apiKey) {
            throw new Error('OpenAI API key not configured. Please add your API key in settings.');
        }

        const messages = [
            { role: 'system', content: this.buildSystemPrompt(transcript, isMiniAssistant) }
        ];

        // Add conversation history
        history.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                messages.push(msg);
            }
        });

        // Add current message
        messages.push({ role: 'user', content: message });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: true,
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
        }

        return this.handleStreamResponse(response);
    }

    async sendGeminiMessage(transcript, message, history, isMiniAssistant = false) {
        const apiKey = this.settingsManager.get('geminiApiKey');
        const model = this.settingsManager.get('geminiModel');

        if (!apiKey) {
            throw new Error('Gemini API key not configured. Please add your API key in settings.');
        }

        // Build conversation context for Gemini
        const systemPrompt = this.buildSystemPrompt(transcript, isMiniAssistant);

        // Build contents array for Gemini format
        const contents = [];

        // Add system prompt as first user message
        contents.push({
            role: 'user',
            parts: [{ text: systemPrompt }]
        });

        // Add a model response to acknowledge the system prompt
        // Add a model response to acknowledge the system prompt
        const modelAcknowledgement = transcript && transcript.trim().length > 0
            ? 'I understand. I will help you analyze this YouTube video transcript and answer questions about it accurately, citing specific timestamps when possible.'
            : 'I understand. I am ready to help.';

        contents.push({
            role: 'model',
            parts: [{ text: modelAcknowledgement }]
        });

        // Add conversation history
        history.forEach(msg => {
            if (msg.role === 'user') {
                contents.push({
                    role: 'user',
                    parts: [{ text: msg.content }]
                });
            } else if (msg.role === 'assistant') {
                contents.push({
                    role: 'model',
                    parts: [{ text: msg.content }]
                });
            }
        });

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000,
                    topK: 40,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error Response:', errorText);
            try {
                const error = JSON.parse(errorText);
                throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
            } catch (e) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
            }
        }

        return this.handleGeminiStreamResponse(response);
    }

    async sendOpenRouterMessage(transcript, message, history, isMiniAssistant = false) {
        const apiKey = this.settingsManager.get('openrouterApiKey');
        const model = this.settingsManager.get('openrouterModel');

        if (!apiKey) {
            throw new Error('OpenRouter API key not configured. Please add your API key in settings.');
        }

        const messages = [
            { role: 'system', content: this.buildSystemPrompt(transcript, isMiniAssistant) }
        ];

        // Add conversation history
        history.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                messages.push(msg);
            }
        });

        // Add current message
        messages.push({ role: 'user', content: message });

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: true,
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
        }

        return this.handleStreamResponse(response);
    }

    async* handleStreamResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') return;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                yield content;
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    async* handleGeminiStreamResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let lastYieldedText = '';

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // This regex finds all "text" fields in the streamed JSON chunks
                const textRegex = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
                let combinedText = '';
                let match;

                while ((match = textRegex.exec(buffer)) !== null) {
                    try {
                        // The matched group is a JSON-escaped string. We need to parse it to get the actual text.
                        combinedText += JSON.parse(`"${match[1]}"`);
                    } catch (e) {
                        console.debug('Failed to parse text part from Gemini stream:', match[1]);
                    }
                }

                if (combinedText.length > lastYieldedText.length) {
                    const newText = combinedText.substring(lastYieldedText.length);
                    yield newText;
                    lastYieldedText = combinedText;
                }
            }
        } finally {
            reader.releaseLock();
        }
    }
}

// Export for use in content.js
window.AIService = AIService;
