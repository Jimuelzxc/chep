// AI Service for handling different AI providers
class AIService {
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
    }

    async sendMessage(transcript, message, history = []) {
        const provider = this.settingsManager.get('aiProvider');

        switch (provider) {
            case 'openai':
                return this.sendOpenAIMessage(transcript, message, history);
            case 'gemini':
                return this.sendGeminiMessage(transcript, message, history);
            default:
                throw new Error(`Unsupported AI provider: ${provider}`);
        }
    }

    buildSystemPrompt(transcript) {
        return `You are a helpful YouTube video assistant.

Your inputs are:
1. The full transcript of the video (below, enclosed in triple dashes).
2. The user's question about that video.

Your job is to:
- **Answer the question concisely and accurately** using only information found in the transcript.
- **Maintain conversation context** by referring to previous exchanges when relevant.
- **Cite evidence by quoting the relevant text and including the exact timestamp that appears at the beginning of that quote in the transcript.** Timestamps must be copied verbatim from the transcript.
- If the transcript does not contain the information needed, say so and explain why.
- Never invent or hallucinate any facts. Do not make up timestamps.

Transcript:
---
${transcript}
---`;
    }

    async sendOpenAIMessage(transcript, message, history) {
        const apiKey = this.settingsManager.get('openaiApiKey');
        const model = this.settingsManager.get('openaiModel');

        if (!apiKey) {
            throw new Error('OpenAI API key not configured. Please add your API key in settings.');
        }

        const messages = [
            { role: 'system', content: this.buildSystemPrompt(transcript) }
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

    async sendGeminiMessage(transcript, message, history) {
        const apiKey = this.settingsManager.get('geminiApiKey');
        const model = this.settingsManager.get('geminiModel');

        if (!apiKey) {
            throw new Error('Gemini API key not configured. Please add your API key in settings.');
        }

        // Build conversation context for Gemini
        const systemPrompt = this.buildSystemPrompt(transcript);

        // Build contents array for Gemini format
        const contents = [];

        // Add system prompt as first user message
        contents.push({
            role: 'user',
            parts: [{ text: systemPrompt }]
        });

        // Add a model response to acknowledge the system prompt
        contents.push({
            role: 'model',
            parts: [{ text: 'I understand. I will help you analyze this YouTube video transcript and answer questions about it accurately, citing specific timestamps when possible.' }]
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