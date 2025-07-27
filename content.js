function createAICompanionUI() {
    const targetElement = document.getElementById('secondary-inner');
    if (!targetElement || document.getElementById('ai-companion-container-ext')) {
        return;
    }

    // --- Inject Styles ---
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --yt-spec-blue-text: #3ea6ff;
            --yt-spec-background-elevation-1: #212121;
            --yt-spec-background-elevation-2: #3f3f3f;
            --yt-spec-text-primary: #ffffff;
            --yt-spec-text-secondary: #aaaaaa;
            --yt-spec-border-color: #535353;
            --gradient-primary: linear-gradient(135deg, #0066ff, #3ea6ff, #66b3ff, #99ccff, #cce6ff);
            --gradient-glow: 0 0 30px rgba(0, 102, 255, 0.4), 0 0 60px rgba(62, 166, 255, 0.3), 0 0 90px rgba(102, 179, 255, 0.2);
        }
        #ai-companion-container-ext {
            font-family: 'Roboto', Arial, sans-serif;
            margin-bottom: 16px;
            color: var(--yt-spec-text-primary);
            background-color: var(--yt-spec-background-elevation-1);
            border-radius: 12px;
            border: 1px solid var(--yt-spec-border-color);
            padding: 0;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        #ai-companion-container-ext.expanded {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            border-radius: 0;
            margin: 0;
        }
        .ai-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            user-select: none;
            background: linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(62, 166, 255, 0.08), rgba(102, 179, 255, 0.06));
            border-bottom: 1px solid rgba(62, 166, 255, 0.2);
        }
        .ai-header-left {
            display: flex;
            align-items: center;
            cursor: pointer;
            flex: 1;
        }
        .ai-header-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .expand-btn,
        .settings-btn {
            background: none;
            border: none;
            color: var(--yt-spec-text-secondary);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        .expand-btn:hover,
        .settings-btn:hover {
            background-color: var(--yt-spec-background-elevation-2);
            color: var(--yt-spec-text-primary);
        }
        .ai-header-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 18px;
            font-weight: 500;
            color: var(--yt-spec-text-primary);
        }
        .ai-header-title svg {
            fill: url(#gradient-fill);
        }
        .ai-header:hover {
            background-color: var(--yt-spec-background-elevation-2);
        }
        .ai-header .chevron {
            transition: transform 0.3s ease;
        }
        #ai-companion-container-ext.collapsed .ai-header .chevron {
            transform: rotate(-90deg);
        }
        .ai-panel {
            padding: 16px;
            border-top: 1px solid var(--yt-spec-border-color);
            display: block;
            transition: all 0.3s ease;
        }
        #ai-companion-container-ext.collapsed .ai-panel {
            display: none;
        }
        #chat-display-ext {
            height: 280px;
            overflow-y: auto;
            margin-bottom: 16px;
            font-size: 14px;
            line-height: 1.5;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        #ai-companion-container-ext.expanded #chat-display-ext {
            height: calc(100vh - 140px);
            font-size: 16px;
        }
        #ai-companion-container-ext.expanded .ai-panel {
            padding: 24px;
        }
        .chat-message {
            display: flex;
            flex-direction: column;
        }
        .chat-bubble {
            padding: 8px 12px;
            border-radius: 18px;
            max-width: 85%;
            word-wrap: break-word;
        }
        .chat-message.user { align-self: flex-end; }
        .chat-message.user .chat-bubble {
            background-color: var(--yt-spec-background-elevation-2);
            color: var(--yt-spec-text-primary);
            border-bottom-right-radius: 4px;
        }
        .chat-message.ai { align-self: flex-start; }
        .chat-message.ai .chat-bubble {
            background-color: transparent;
            padding: 0;
        }
        .md-content h1, .md-content h2, .md-content h3 {
            margin: 10px 0 5px;
        }
        .md-content ul {
            padding-left: 20px;
        }
        .chat-input-container { display: flex; gap: 10px; }
        #chat-input-ext {
            flex-grow: 1;
            padding: 10px 16px;
            border: 1px solid var(--yt-spec-border-color);
            background-color: #121212;
            color: var(--yt-spec-text-primary);
            border-radius: 20px;
            font-size: 14px;
        }
        #chat-input-ext:focus {
            outline: none;
            border-color: var(--yt-spec-blue-text);
        }
        #chat-send-btn-ext {
            height: 40px;
            width: 40px;
            border: none;
            background: var(--gradient-primary);
            color: white;
            cursor: pointer;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-weight: 500;
            font-size: 14px;
            box-shadow: var(--gradient-glow);
            position: relative;
            overflow: hidden;
        }
        #chat-send-btn-ext::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        #chat-send-btn-ext:hover::before {
            opacity: 1;
        }
        #chat-send-btn-ext:hover {
            transform: translateY(-1px);
            box-shadow: var(--gradient-glow), 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        #chat-send-btn-ext:disabled {
            background: #3f3f3f;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }
        #chat-send-btn-ext:disabled::before {
            opacity: 0;
        }
        .yt-timestamp-link {
            color: var(--yt-spec-blue-text);
            text-decoration: none;
            cursor: pointer;
        }
        .yt-timestamp-link:hover {
            text-decoration: underline;
        }
        
        /* Loading Animation Styles */
        .loading-message {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--yt-spec-text-secondary);
        }
        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid var(--yt-spec-border-color);
            border-top: 2px solid var(--yt-spec-blue-text);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 0;
        }
        .typing-dot {
            width: 6px;
            height: 6px;
            background-color: var(--yt-spec-text-secondary);
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        .typing-dot:nth-child(3) { animation-delay: 0s; }
        @keyframes typing {
            0%, 80%, 100% { opacity: 0.3; }
            40% { opacity: 1; }
        }

    `;
    document.head.appendChild(style);

    // --- Create UI Elements ---
    const container = document.createElement('div');
    container.id = 'ai-companion-container-ext';
    container.classList.add('collapsed');
    container.innerHTML = `
        <svg width="0" height="0" style="position: absolute;">
            <defs>
                <linearGradient id="gradient-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#0066ff;stop-opacity:1" />
                    <stop offset="25%" style="stop-color:#3ea6ff;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#66b3ff;stop-opacity:1" />
                    <stop offset="75%" style="stop-color:#99ccff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cce6ff;stop-opacity:1" />
                </linearGradient>
            </defs>
        </svg>
        <div class="ai-header">
            <div class="ai-header-left">
                <div class="ai-header-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="url(#gradient-fill)"></path>
                        <path d="M5 3v4" fill="url(#gradient-fill)"></path>
                        <path d="M19 17v4" fill="url(#gradient-fill)"></path>
                        <path d="M3 5h4" fill="url(#gradient-fill)"></path>
                        <path d="M17 19h4" fill="url(#gradient-fill)"></path>
                    </svg>
                    <span>AI Assistant</span>
                </div>
            </div>
            <div class="ai-header-controls">
                <button class="settings-btn" title="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-3.5L19 4m-7 7-2.5 2.5M4 19l2.5-2.5m7-7L16 7"></path></svg>
                </button>
                <button class="expand-btn" title="Expand chat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
        </div>
        <div class="ai-panel">
            <div id="chat-display-ext"></div>
            <div class="chat-input-container">
                <input type="text" id="chat-input-ext" placeholder="Ask a question...">
                <button id="chat-send-btn-ext" title="Ask">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>
                </button>
            </div>
        </div>
    `;
    targetElement.prepend(container);

    // --- Initialize Settings Manager and AI Service ---
    const settingsManager = new window.SettingsManager();
    const aiService = new window.AIService(settingsManager);
    
    // --- Get Element References ---
    const header = container.querySelector('.ai-header');
    const headerLeft = container.querySelector('.ai-header-left');
    const settingsButton = container.querySelector('.settings-btn');
    const expandButton = container.querySelector('.expand-btn');
    const chatDisplay = document.getElementById('chat-display-ext');
    const chatInput = document.getElementById('chat-input-ext');
    const chatSendButton = document.getElementById('chat-send-btn-ext');
    let isFirstOpen = true;
    let chatHistory = []; // Store conversation history

    // --- Event Listeners ---
    chatDisplay.addEventListener('click', (e) => {
        if (e.target.classList.contains('yt-timestamp-link') && settingsManager.get('enableTimestampLinks')) {
            e.preventDefault();
            const seconds = e.target.dataset.seconds;
            const player = document.querySelector('.html5-main-video');
            if (player && seconds) {
                player.currentTime = seconds;
                player.play();
            }
        }
    });

    headerLeft.onclick = async () => {
        container.classList.toggle('collapsed');
        if (!container.classList.contains('collapsed') && isFirstOpen) {
            await loadTranscriptOnOpen();
            isFirstOpen = false;
        }
    };

    settingsButton.onclick = (e) => {
        e.stopPropagation(); // Prevent header click
        settingsManager.showSettings();
    };

    expandButton.onclick = (e) => {
        e.stopPropagation(); // Prevent header click
        toggleExpandedMode();
    };

    chatSendButton.onclick = handleChat;
    chatInput.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(); } };

    // Apply initial settings
    settingsManager.applySettings();

    // Listen for settings changes
    window.addEventListener('ai-settings-changed', (e) => {
        const settings = e.detail;
        // Update chat behavior based on settings
        if (settings.autoScrollToBottom && chatDisplay.scrollHeight > chatDisplay.clientHeight) {
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!settingsManager.get('enableKeyboardShortcuts')) return;
        
        // Only activate shortcuts when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        // Ctrl/Cmd + Shift + A: Toggle AI panel
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            headerLeft.click();
        }
        
        // Ctrl/Cmd + Shift + S: Open settings
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            settingsManager.showSettings();
        }
        
        // Ctrl/Cmd + Shift + F: Toggle fullscreen
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            toggleExpandedMode();
        }
        
        // Focus chat input when AI panel is open
        if (e.key === '/' && !container.classList.contains('collapsed')) {
            e.preventDefault();
            chatInput.focus();
        }
    });

    // --- Helper Functions ---
    function parseMarkdown(text) {
        let html = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        html = html.replace(/^\s*[\*\-\+]\s+(.*)/gm, '<ul><li>$1</li></ul>').replace(/<\/ul>\n?<ul>/g, '');
        html = html.replace(/^###\s+(.*)/gm, '<h3>$1</h3>').replace(/^##\s+(.*)/gm, '<h2>$1</h2>').replace(/^#\s+(.*)/gm, '<h1>$1</h1>');
        html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>').replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');

        html = html.replace(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/g, (match) => {
            const parts = match.split(':').map(Number);
            let seconds = 0;
            if (parts.length === 3) { // HH:MM:SS
                seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) { // MM:SS
                seconds = parts[0] * 60 + parts[1];
            }
            return `<a href="#" class="yt-timestamp-link" data-seconds="${seconds}">${match}</a>`;
        });

        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function getTranscriptText() {
        const segments = document.querySelectorAll('ytd-transcript-segment-renderer .segment');
        if (segments.length === 0) { return null; }
        return Array.from(segments).map(el => el.innerText.trim()).join(' ');
    }

    function autoOpenTranscript() {
        // Check if transcript is already open
        if (document.querySelectorAll('ytd-transcript-segment-renderer .segment').length > 0) {
            return true; // Already open
        }

        // Try to find and click the transcript button
        const transcriptButton = document.querySelector('button[aria-label*="transcript" i], button[aria-label*="Show transcript" i]');
        if (transcriptButton) {
            transcriptButton.click();
            return true;
        }

        // Alternative: Look for the three-dot menu and transcript option
        const moreButton = document.querySelector('button[aria-label="More actions"]');
        if (moreButton) {
            moreButton.click();

            // Wait a bit for menu to appear, then look for transcript option
            setTimeout(() => {
                const transcriptMenuItem = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item'))
                    .find(item => item.textContent.toLowerCase().includes('transcript'));

                if (transcriptMenuItem) {
                    transcriptMenuItem.click();
                }
            }, 100);
            return true;
        }

        return false; // Could not find transcript button
    }

    async function handleChat() {
        const message = chatInput.value.trim();
        if (!message) return;

        let transcript = getTranscriptText();
        if (!transcript) {
            // Show loading message with spinner
            const loadingBubble = appendLoadingMessage("Opening transcript...");
            const opened = autoOpenTranscript();

            if (opened) {
                // Wait a moment for transcript to load
                await new Promise(resolve => setTimeout(resolve, 1500));
                transcript = getTranscriptText();
            }

            // Remove loading message
            loadingBubble.remove();

            if (!transcript) {
                appendChatMessage("⚠️ Could not access the transcript. Please manually open the transcript by clicking the three-dot menu (...) below the video and selecting 'Show transcript'.", 'ai');
                return;
            } else {
                appendChatMessage("🎬 Transcript loaded! Processing your question...", 'ai');
            }
        }

        // Check if AI provider is configured
        const provider = settingsManager.get('aiProvider');
        const isConfigured = checkAIProviderConfiguration(provider);
        
        if (!isConfigured) {
            appendChatMessage("⚠️ AI provider not configured. Please go to Settings and add your API key.", 'ai');
            return;
        }

        // Add user message to history
        chatHistory.push({ role: 'user', content: message });
        appendChatMessage(message, 'user');
        chatInput.value = '';
        chatSendButton.disabled = true;

        // Show typing indicator while AI is thinking
        const typingIndicator = appendTypingIndicator();
        let fullResponse = '';

        try {
            // Use the AI service to get streaming response
            const responseStream = await aiService.sendMessage(
                transcript, 
                message, 
                chatHistory.slice(-settingsManager.get('maxChatHistory'))
            );

            // Remove typing indicator and add AI response bubble
            typingIndicator.remove();
            const aiBubble = appendChatMessage('', 'ai');

            // Handle streaming response
            for await (const chunk of responseStream) {
                fullResponse += chunk;
                aiBubble.innerHTML = parseMarkdown(fullResponse);
                
                // Auto-scroll if enabled
                if (settingsManager.get('autoScrollToBottom')) {
                    chatDisplay.scrollTop = chatDisplay.scrollHeight;
                }
                
                // Add typing delay if configured
                const typingSpeed = settingsManager.get('typingSpeed');
                if (typingSpeed > 0) {
                    await new Promise(resolve => setTimeout(resolve, typingSpeed));
                }
            }

            // Add AI response to history
            chatHistory.push({ role: 'assistant', content: fullResponse });
        } catch (err) {
            // Remove typing indicator on error
            typingIndicator.remove();
            appendChatMessage(`❌ Error: ${err.message}`, 'ai');
        } finally {
            chatSendButton.disabled = false;
        }
    }

    function checkAIProviderConfiguration(provider) {
        switch (provider) {
            case 'openai':
                return !!settingsManager.get('openaiApiKey');
            case 'gemini':
                return !!settingsManager.get('geminiApiKey');
            case 'claude':
                return !!settingsManager.get('claudeApiKey');
            case 'ollama':
                return !!settingsManager.get('ollamaEndpoint');
            default:
                return false;
        }
    }



    function appendChatMessage(text, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${sender}`;

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'chat-bubble';

        if (sender === 'ai') {
            bubbleEl.innerHTML = `${parseMarkdown(text)}`;
        } else {
            bubbleEl.textContent = text;
        }

        messageEl.appendChild(bubbleEl);
        chatDisplay.appendChild(messageEl);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
        return bubbleEl;
    }

    function appendLoadingMessage(text) {
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message ai';

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'chat-bubble loading-message';
        bubbleEl.innerHTML = `
            <div class="loading-spinner"></div>
            <span>${text}</span>
        `;

        messageEl.appendChild(bubbleEl);
        chatDisplay.appendChild(messageEl);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
        return messageEl;
    }

    function appendTypingIndicator() {
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message ai';

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'chat-bubble';
        bubbleEl.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        messageEl.appendChild(bubbleEl);
        chatDisplay.appendChild(messageEl);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
        return messageEl;
    }

    async function loadTranscriptOnOpen() {
        let transcript = getTranscriptText();

        if (!transcript) {
            // Show loading message with spinner
            const loadingBubble = appendLoadingMessage("Accessing video transcript...");

            // Try to auto-open transcript
            const opened = autoOpenTranscript();

            if (opened) {
                // Wait for transcript to load
                await new Promise(resolve => setTimeout(resolve, 1500));
                transcript = getTranscriptText();
            }

            // Remove loading message
            loadingBubble.remove();

            if (transcript) {
                appendChatMessage("Ready to discuss this video! What would you like to know?", 'ai');
            } else {
                appendChatMessage("⚠️ Couldn't access the transcript automatically. Please open it manually by clicking the three-dot menu (...) below the video and selecting 'Show transcript'.", 'ai');
            }
        } else {
            // Transcript already available
            appendChatMessage("Ready to discuss this video! What would you like to know?", 'ai');
        }
    }

    function toggleExpandedMode() {
        const isExpanded = container.classList.contains('expanded');

        if (isExpanded) {
            // Exit expanded mode
            container.classList.remove('expanded');
            expandButton.title = "Expand chat";
            expandButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
            `;
        } else {
            // Enter expanded mode
            container.classList.add('expanded');
            container.classList.remove('collapsed'); // Ensure it's not collapsed when expanding
            expandButton.title = "Exit full screen";
            expandButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
            `;

            // Load transcript if this is the first time opening
            if (isFirstOpen) {
                loadTranscriptOnOpen();
                isFirstOpen = false;
            }
        }

        // Scroll to bottom after mode change
        setTimeout(() => {
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }, 100);
    }

    function setInitialMessage() {
        const transcript = getTranscriptText();
        if (transcript) {
            appendChatMessage("Ask me anything about this video!", 'ai');
        } else {
            appendChatMessage("Open the transcript to start chatting with the video.", 'ai');
        }
    }
}

// --- Initializer ---
let currentVideoId = null;

function getVideoId(url) {
    try {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get('v');
    } catch (e) {
        return null;
    }
}

function handlePageChange() {
    const newVideoId = getVideoId(window.location.href);

    // If we are not on a watch page or there's no video ID
    if (window.location.pathname !== '/watch' || !newVideoId) {
        const existingUI = document.getElementById('ai-companion-container-ext');
        if (existingUI) {
            existingUI.remove();
        }
        currentVideoId = null;
        return;
    }

    // If we are on a new video page
    if (newVideoId !== currentVideoId) {
        currentVideoId = newVideoId;
        const existingUI = document.getElementById('ai-companion-container-ext');
        if (existingUI) {
            existingUI.remove();
        }

        // Wait for the target element to be ready before injecting the UI
        const targetCheckInterval = setInterval(() => {
            const targetElement = document.getElementById('secondary-inner');
            if (targetElement) {
                clearInterval(targetCheckInterval);
                createAICompanionUI();
            }
        }, 200);
    }
}

// YouTube uses single-page navigation (History API). We need to listen for these changes.
// A MutationObserver is more efficient than setInterval for this.
const observer = new MutationObserver(() => {
    // A simple href check is enough for this use case.
    if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        handlePageChange();
    }
});

let lastUrl = window.location.href;
observer.observe(document.body, { childList: true, subtree: true });

// Initial check in case the script loads on a video page directly.
handlePageChange();
