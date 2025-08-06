function createAICompanionUI() {
    const targetElement = document.getElementById('secondary-inner');
    if (!targetElement || document.getElementById('ai-companion-container-ext')) {
        return;
    }

    // --- Inject Styles ---
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --yt-spec-blue-text: #3ea2ffff;
            --yt-spec-background-elevation-1: #212121;
            --yt-spec-background-elevation-2: #3f3f3f;
            --yt-spec-text-primary: #ffffff;
            --yt-spec-text-secondary: #aaaaaa;
            --yt-spec-border-color: #535353;
            --gradient-primary: linear-gradient(135deg, #0066ff, #3e7bffff, #66b3ff, #99b1ffff, #cce6ff);
            --gradient-glow: 0 0 30px rgba(0, 102, 255, 0.88), 0 0 60px rgba(33, 143, 240, 0.47), 0 0 90px rgba(102, 179, 255, 0.2);
        }
        #ai-companion-container-ext {
            font-family: 'Roboto', Arial, sans-serif;
            margin-bottom: 16px;
            color: var(--yt-spec-text-primary);
            background-color: #212121;
            border-radius: 12px;
            border: 1px solid var(--yt-spec-border-color);
            padding: 0;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .ai-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            user-select: none;
            background: linear-gradient(135deg, rgba(0, 102, 255, 0.09), rgba(62, 165, 255, 0.07), rgba(39, 90, 167, 0.4));
            transition: background 0.4s ease-in-out;

        }
        .ai-header:hover{
            background: linear-gradient(135deg, rgba(0, 102, 255, 0.21), rgba(62, 165, 255, 0.26), rgba(102, 179, 255, 0.02));
        
        
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
        .reset-btn,
        .settings-btn,
        .slash-commands-btn,
        .video-context-btn {
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
        .reset-btn:hover,
        .settings-btn:hover,
        .slash-commands-btn:hover,
        .video-context-btn:hover {
            background-color: var(--yt-spec-background-elevation-2);
            color: var(--yt-spec-text-primary);
        }
        .ai-header-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            font-weight: 500;
            color: var(--yt-spec-text-primary);
        }
        .ai-header-title svg {
            fill: url(#gradient-fill);
        }
        .ai-header-title span {
            transition: all 0.3s ease;
        }
        #ai-companion-container-ext.collapsed .ai-header-title span::after {
            content: ' - Ask a question...';
            font-weight: 400;
            opacity: 0.7;
            font-size: 0.9em;
            margin-left: 4px;
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
        li {
        padding: 20px 20px; 
        }
        .chat-message {
            display: flex;
            flex-direction: column;
        }
        .chat-bubble {
            padding: 8px 12px;
            border-radius: 18px;
            max-width: 90%;
            word-wrap: break-word;
        }
        .chat-username {
            font-size: 12px;
            color: var(--yt-spec-text-secondary);
            margin-bottom: 4px;
            font-weight: 500;
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
        .message-actions {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            justify-content: flex-start;
        }
        .regenerate-btn,
        .copy-btn {
            background: none;
            border: 1px solid var(--yt-spec-border-color);
            color: var(--yt-spec-text-secondary);
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }
        .regenerate-btn:hover,
        .copy-btn:hover {
            background-color: var(--yt-spec-background-elevation-2);
            color: var(--yt-spec-text-primary);
            border-color: var(--yt-spec-blue-text);
        }
        .regenerate-btn:disabled,
        .copy-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .copy-btn.copied {
            background-color: rgba(0, 255, 0, 0.1);
            border-color: rgba(0, 255, 0, 0.3);
            color: #4ade80;
        }
        .md-content h1, .md-content h2, .md-content h3 {
            margin: 10px 0 5px;
        }
        .md-content ul {
            padding-left: 20px;
        }
        .chat-input-container { 
            display: flex; 
            width: 100%;
        }
        .chat-input-wrapper {
            flex-grow: 1;
            position: relative;
            display: flex;
            align-items: center;
            border: 1px solid var(--yt-spec-border-color);
            background-color: #121212;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .chat-input-wrapper:focus-within {
            border-color: var(--yt-spec-blue-text);
            box-shadow: 0 0 0 2px rgba(62, 166, 255, 0.2);
        }
        #chat-input-ext {
            flex-grow: 1;
            padding: 12px 16px;
            padding-right: 50px;
            border: none;
            background: transparent;
            color: var(--yt-spec-text-primary);
            font-size: 14px;
            outline: none;
            box-sizing: border-box;
        }
        .slash-commands-dropdown {
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            background-color: #303030ff;
            border: 1px solid var(--yt-spec-border-color);
            border-radius: 8px;
            margin-bottom: 8px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        }
        .slash-command-item {
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid var(--yt-spec-border-color);
            transition: background-color 0.2s ease;
        }
        .slash-command-item:last-child {
            border-bottom: none;
        }
        .slash-command-item:hover,
        .slash-command-item.selected {
            background-color: var(--yt-spec-blue-text);
            color: white;
        }
        .slash-command-key {
            color: var(--yt-spec-blue-text);
            font-weight: 500;
        }
        .slash-command-item:hover .slash-command-key,
        .slash-command-item.selected .slash-command-key {
            color: white;
        }
        .slash-command-value {
            color: var(--yt-spec-text-secondary);
            font-size: 12px;
            margin-left: 8px;
        }
        .slash-command-item:hover .slash-command-value,
        .slash-command-item.selected .slash-command-value {
            color: rgba(255, 255, 255, 0.8);
        }
        .chat-input-wrapper.focus-animation {
            animation: focusGlow 1.5s ease-out;
        }
        @keyframes focusGlow {
            0% {
                border-color: var(--yt-spec-border-color);
                box-shadow: 0 0 0 0 rgba(62, 166, 255, 0);
            }
            50% {
                border-color: var(--yt-spec-blue-text);
                box-shadow: 0 0 0 4px rgba(62, 166, 255, 0.3);
            }
            100% {
                border-color: var(--yt-spec-border-color);
                box-shadow: 0 0 0 0 rgba(62, 166, 255, 0);
            }
        }
        #chat-send-btn-ext {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            height: 30px;
            width: 30px;
            border: none;
            background: var(--gradient-primary);
            color: white;
            cursor: pointer;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-weight: 500;
            font-size: 14px;
            overflow: hidden;
        }
        #chat-send-btn-ext:hover {
            background: var(--gradient-primary);
            box-shadow: var(--gradient-glow);

}
        .yt-timestamp-link {
            color: var(--yt-spec-blue-text);
            text-decoration: none;
            cursor: pointer;
            background: rgba(62, 166, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 500;
            transition: all 0.2s ease;
            border: 1px solid rgba(62, 166, 255, 0.2);
        }
        .yt-timestamp-link:hover {
            background: rgba(62, 166, 255, 0.2);
            border-color: rgba(62, 166, 255, 0.4);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(62, 166, 255, 0.3);
        }
        .yt-timestamp-link:active {
            transform: translateY(0);
            background: rgba(62, 166, 255, 0.3);
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

        /* Suggested Prompts Styles */
        .suggested-prompts-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
            justify-content: center;
        }
        .suggested-prompt-button {
            background-color: var(--yt-spec-background-elevation-2);
            color: var(--yt-spec-text-primary);
            border: 1px solid var(--yt-spec-border-color);
            border-radius: 5px;
            padding: 8px 12px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        .suggested-prompt-button:hover {
            background-color: var(--yt-spec-blue-text);
            border-color: var(--yt-spec-blue-text);
            color: white;
        }
        .suggested-prompt-button:active {
            transform: translateY(1px);
        }

    `;
    style.textContent += `
        .video-context-toggle-ext {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            padding-left: 4px;
        }
        .video-context-toggle-ext label {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
        }
        .video-context-toggle-ext .label-text {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
        }
        .video-context-toggle-ext .label-main {
            font-size: 13px;
            font-weight: 500;
            color: var(--yt-spec-text-secondary);
            transition: color 0.2s ease;
        }
        .video-context-toggle-ext .label-sub {
            font-size: 11px;
            font-weight: 400;
            color: var(--yt-spec-text-secondary);
        }
        .video-context-toggle-ext input[type="checkbox"] {
            display: none;
        }
        .video-context-toggle-ext .checkbox-visual {
            width: 16px;
            height: 16px;
            border: 2px solid var(--yt-spec-text-secondary);
            border-radius: 4px;
            margin-right: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        .video-context-toggle-ext .checkbox-visual svg {
            display: none;
        }
        .video-context-toggle-ext input[type="checkbox"]:checked + label .checkbox-visual {
            background-color: var(--yt-spec-blue-text);
            border-color: var(--yt-spec-blue-text);
        }
        .video-context-toggle-ext input[type="checkbox"]:checked + label .checkbox-visual svg {
            display: block;
            color: white;
            width: 12px;
            height: 12px;
        }
        .video-context-toggle-ext input[type="checkbox"]:checked + label .label-main {
            color: var(--yt-spec-text-primary);
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
                    <img src="${chrome.runtime.getURL('assets/chep-logo.png')}" alt="Chep" style="width: 24px; height: 24px; opacity: 90%; ">
                    <span style="transform: translate(-6px, 2px);">Chep</span>

                </div>
            </div>
            <div class="ai-header-controls">
                <button class="reset-btn" title="Clear Conversation" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
                <button class="slash-commands-btn" title="Slash Commands (Ctrl+Shift+C)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16"></path>
                    </svg>
                </button>
                <button class="settings-btn" title="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.82l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.82l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
        </div>
        <div class="ai-panel">
            <div id="chat-display-ext"></div>
            <div class="suggested-prompts-container" id="suggested-prompts-ext"></div>
            <div class="video-context-toggle-ext">
                <input type="checkbox" id="video-context-checkbox-ext">
                <label for="video-context-checkbox-ext">
                    <span class="checkbox-visual">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
                    </span>
                    <span class="label-text">
                        <span class="label-main">Video Context</span>
                        <span class="label-sub"></span>
                    </span>
                </label>
            </div>
            <div class="chat-input-container">
                <div class="chat-input-wrapper">
                    <div class="slash-commands-dropdown" id="slash-commands-dropdown-ext"></div>
                    <input type="text" id="chat-input-ext" placeholder="Ask a question... (type / for shortcuts)">
                    <button id="chat-send-btn-ext" title="Ask">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    targetElement.prepend(container);

    // --- Initialize Settings Manager and AI Service ---
    const settingsManager = new window.SettingsManager();
    const aiService = new window.AIService(settingsManager);

    // --- Slash Commands System ---
    const defaultSlashCommands = {
        '/simple': 'use simple english',
        '/formal': 'use formal tone',
        '/explain': 'explain this in detail',
        '/summary': 'give me a brief summary',
        '/key': 'what are the key points?',
        '/main': 'what is the main topic?',
        '/takeaway': 'what are the key takeaways?',
        '/beginner': 'explain this for beginners',
        '/technical': 'give me technical details',
        '/examples': 'provide examples'
    };

    // Load custom slash commands from storage
    let customSlashCommands = {};
    try {
        const stored = localStorage.getItem('ai-companion-slash-commands');
        if (stored) {
            customSlashCommands = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load custom slash commands:', e);
    }

    // Combine default and custom commands
    function getAllSlashCommands() {
        return { ...defaultSlashCommands, ...customSlashCommands };
    }

    // Save custom commands to storage
    function saveCustomSlashCommands() {
        try {
            localStorage.setItem('ai-companion-slash-commands', JSON.stringify(customSlashCommands));
        } catch (e) {
            console.warn('Failed to save custom slash commands:', e);
        }
    }

    // --- Initialize Mini LLM Popup ---
    let miniPopupInitialized = false;

    function initializeMiniPopupIfEnabled() {
        if (settingsManager.get('enableMiniPopup') && !miniPopupInitialized) {
            initializeMiniLLMPopup(settingsManager, aiService, getTranscriptText);
            miniPopupInitialized = true;
        } else if (!settingsManager.get('enableMiniPopup') && miniPopupInitialized) {
            // Remove popup if it exists
            const existingPopup = document.querySelector('.mini-llm-popup');
            if (existingPopup) {
                existingPopup.remove();
            }
            miniPopupInitialized = false;
        }
    }

    // Initialize on load
    initializeMiniPopupIfEnabled();

    // Listen for settings changes
    window.addEventListener('ai-settings-changed', () => {
        initializeMiniPopupIfEnabled();
    });

    // --- Get Element References ---
    const header = container.querySelector('.ai-header');
    const headerLeft = container.querySelector('.ai-header-left');
    const resetButton = container.querySelector('.reset-btn');
    const settingsButton = container.querySelector('.settings-btn');
    const slashCommandsButton = container.querySelector('.slash-commands-btn');
    const chatDisplay = document.getElementById('chat-display-ext');
    const chatInput = document.getElementById('chat-input-ext');
    const chatSendButton = document.getElementById('chat-send-btn-ext');
    const suggestedPromptsContainer = document.getElementById('suggested-prompts-ext');
    const slashCommandsDropdown = document.getElementById('slash-commands-dropdown-ext');
    let isFirstOpen = true;
    let chatHistory = []; // Store conversation history
    let isUserScrolling = false; // Track if user is manually scrolling
    let autoScrollEnabled = true; // Track if auto-scroll should be enabled
    let trashIconVisible = false; // Track trash icon visibility state
    let selectedCommandIndex = -1; // Track selected command in dropdown
    let filteredCommands = []; // Store filtered commands for dropdown
    let videoContextEnabled = true; // Local state for video context
    const videoContextCheckbox = document.getElementById('video-context-checkbox-ext');

    // --- Event Listeners ---
    chatDisplay.addEventListener('click', (e) => {
        if (e.target.classList.contains('yt-timestamp-link') && settingsManager.get('enableTimestampLinks')) {
            e.preventDefault();
            const seconds = e.target.dataset.seconds;
            const player = document.querySelector('.html5-main-video');
            if (player && seconds) {
                // Add visual feedback
                e.target.style.background = 'rgba(62, 166, 255, 0.4)';
                setTimeout(() => {
                    e.target.style.background = 'rgba(62, 166, 255, 0.1)';
                }, 200);

                player.currentTime = seconds;
                player.play();
            }
        }
    });

    suggestedPromptsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggested-prompt-button')) {
            chatInput.value = e.target.textContent;
            hideSuggestedPrompts(); // Hide suggestions after click
            handleChat();
        }
    });

    // Add scroll detection to handle manual scrolling during streaming
    let scrollTimeout;
    chatDisplay.addEventListener('scroll', () => {
        const isAtBottom = chatDisplay.scrollTop + chatDisplay.clientHeight >= chatDisplay.scrollHeight - 5;

        if (!isAtBottom) {
            // User scrolled up, disable auto-scroll
            isUserScrolling = true;
            autoScrollEnabled = false;
        } else {
            // User scrolled back to bottom, re-enable auto-scroll
            isUserScrolling = false;
            autoScrollEnabled = true;
        }

        // Clear existing timeout and set a new one
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 150);
    });

    headerLeft.onclick = async () => {
        container.classList.toggle('collapsed');

        // Update the text based on toggle state
        if (container.classList.contains('collapsed')) {
            // Hide trash icon when collapsed
            trashIconVisible = false;
            resetButton.style.display = 'none';
        } else {
            // Toggle trash icon visibility when expanded
            trashIconVisible = !trashIconVisible;
            resetButton.style.display = trashIconVisible ? 'flex' : 'none';

            // Focus input and trigger animation when panel expands
            setTimeout(() => {
                chatInput.focus();
                chatInput.classList.add('focus-animation');

                // Remove animation class after animation completes
                setTimeout(() => {
                    chatInput.classList.remove('focus-animation');
                }, 1500);
            }, 300); // Small delay to allow panel to expand
        }

        if (!container.classList.contains('collapsed') && isFirstOpen) {
            await loadTranscriptOnOpen();
            isFirstOpen = false;
        }
    };

    settingsButton.onclick = (e) => {
        e.stopPropagation(); // Prevent header click
        settingsManager.showSettings();
    };

    slashCommandsButton.onclick = (e) => {
        e.stopPropagation(); // Prevent header click
        showSlashCommandsManager();
    };

    // Set initial state and handle changes for the video context checkbox
    if (videoContextCheckbox) {
        videoContextCheckbox.checked = videoContextEnabled;

        const subLabel = container.querySelector('.label-sub');

        const updateSubLabel = () => {
            if (subLabel) {
                subLabel.textContent = videoContextCheckbox.checked
                    ? 'AI uses video context to answer your question.'
                    : 'AI answer your question without video context.';
            }
        };

        videoContextCheckbox.addEventListener('change', () => {
            videoContextEnabled = videoContextCheckbox.checked;
            updateSubLabel();
        });

        // Set initial text
        updateSubLabel();
    }

    resetButton.onclick = (e) => {
        e.stopPropagation(); // Prevent header click
        resetChat();
    };

    chatSendButton.onclick = handleChat;

    // Enhanced input handling with slash commands
    chatInput.oninput = handleInputChange;
    chatInput.onkeydown = handleInputKeydown;

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatInput.contains(e.target) && !slashCommandsDropdown.contains(e.target)) {
            hideSlashCommandsDropdown();
        }
    });

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

    // Add slash commands management to settings
    function showSlashCommandsManager() {
        const modal = document.createElement('div');
        modal.id = 'slash-command-manager-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.8); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            backdrop-filter: blur(4px);
        `;

        const content = document.createElement('div');
        content.className = 'slash-manager-content';
        content.innerHTML = `
            <div class="slash-manager-header">
                <h2 class="slash-manager-title">Slash Commands Manager</h2>
                <p class="slash-manager-subtitle">Manage your custom slash commands. Type <strong>/</strong> in the chat to see all available commands.</p>
            </div>

            <div class="slash-manager-section">
                <h3 class="slash-manager-section-title">Default Commands</h3>
                <div id="default-commands-list" class="slash-manager-list"></div>
            </div>

            <div class="slash-manager-section">
                <h3 class="slash-manager-section-title">Custom Commands</h3>
                <div id="custom-commands-list" class="slash-manager-list"></div>
                <div class="slash-manager-add-form">
                    <input type="text" id="new-command-key" placeholder="/mycommand" class="slash-manager-input">
                    <input type="text" id="new-command-value" placeholder="Expanded text" class="slash-manager-input">
                    <button id="add-command-btn" class="slash-manager-button add">Add</button>
                </div>
            </div>

            <div class="slash-manager-footer">
                <button id="close-modal-btn" class="slash-manager-button close">Close</button>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .slash-manager-content {
                background: #282828;
                border-radius: 12px;
                border: 1px solid #3F3F3F;
                padding: 24px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                color: #FFFFFF;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                font-family: "Roboto", "Arial", sans-serif;
            }
            .slash-manager-header { text-align: left; margin-bottom: 24px; }
            .slash-manager-title { margin: 0 0 8px; color: #FFFFFF; font-size: 20px; font-weight: 500; }
            .slash-manager-subtitle { margin: 0; color: #AAAAAA; font-size: 14px; }
            .slash-manager-section { margin-bottom: 24px; }
            .slash-manager-section-title {
                margin: 0 0 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #3F3F3F;
                color: #FFFFFF;
                font-size: 16px;
                font-weight: 500;
            }
            .slash-manager-list {
                background: #1E1E1E;
                border-radius: 8px;
                padding: 8px;
                font-size: 14px;
            }
            .slash-manager-list .command-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                border-radius: 6px;
                transition: background-color 0.2s;
            }
            .command-item strong { color: #3EA6FF; font-weight: 500; min-width: 120px; }
            .command-item span { flex: 1; color: #AAAAAA; }
            .command-item .delete-btn {
                background: #CC0000; color: white; border: none; border-radius: 4px;
                cursor: pointer; font-size: 12px; padding: 6px 10px;
                opacity: 0.9; transition: all 0.2s;
            }
            .command-item:hover { background-color: #3F3F3F; }
            .command-item:hover .delete-btn { opacity: 1; background: #FF4444; }
            .slash-manager-add-form { display: flex; gap: 12px; margin-top: 16px; }
            .slash-manager-input {
                flex: 1; padding: 10px; background: #121212;
                border: 1px solid #3F3F3F; border-radius: 6px;
                color: #FFFFFF; font-size: 14px;
            }
            .slash-manager-input:focus { outline: none; border-color: #3EA6FF; }
            .slash-manager-button {
                padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;
                font-size: 14px; font-weight: 500; transition: all 0.2s;
                text-transform: uppercase;
            }
            .slash-manager-button.add { background: #3EA6FF; color: #0F0F0F; }
            .slash-manager-button.add:hover { filter: brightness(1.1); }
            .slash-manager-button.close {
                background: #3F3F3F;
                color: #FFFFFF;
            }
            .slash-manager-button.close:hover { background: #535353; }
            .slash-manager-footer { display: flex; justify-content: flex-end; margin-top: 24px; }
        `;

        modal.appendChild(style);
        modal.appendChild(content);
        document.body.appendChild(modal);

        const defaultList = content.querySelector('#default-commands-list');
        defaultList.innerHTML = Object.entries(defaultSlashCommands)
            .map(([key, value]) => `<div class="command-item"><strong>${key}</strong> → <span>${value}</span></div>`)
            .join('');

        const customList = content.querySelector('#custom-commands-list');

        function updateCustomCommandsList() {
            customList.innerHTML = Object.entries(customSlashCommands)
                .map(([key, value]) => `
                    <div class="command-item" data-command-key="${key}">
                        <strong>${key}</strong> → <span>${value}</span>
                        <button class="delete-btn">Delete</button>
                    </div>
                `).join('') || '<div class="command-item" style="font-style: italic; color: var(--yt-spec-text-secondary);">No custom commands yet</div>';
        }

        function addCustomCommand() {
            const keyInput = content.querySelector('#new-command-key');
            const valueInput = content.querySelector('#new-command-value');
            const key = keyInput.value.trim();
            const value = valueInput.value.trim();

            if (!key || !value) return alert('Please enter both command and text.');
            if (!key.startsWith('/')) return alert('Command must start with /.');
            if (defaultSlashCommands[key]) return alert('Cannot override default commands.');

            customSlashCommands[key] = value;
            saveCustomSlashCommands();
            updateCustomCommandsList();
            keyInput.value = '';
            valueInput.value = '';
        }

        function deleteCustomCommand(key) {
            delete customSlashCommands[key];
            saveCustomSlashCommands();
            updateCustomCommandsList();
        }

        function closeModal() {
            document.body.removeChild(modal);
        }

        content.querySelector('#add-command-btn').addEventListener('click', addCustomCommand);
        content.querySelector('#close-modal-btn').addEventListener('click', closeModal);
        customList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const item = e.target.closest('.command-item');
                if (item) {
                    const key = item.dataset.commandKey;
                    deleteCustomCommand(key);
                }
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        updateCustomCommandsList();
    }

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

        // Focus chat input when AI panel is open
        if (e.key === '/' && !container.classList.contains('collapsed')) {
            e.preventDefault();
            chatInput.focus();
        }

        // Ctrl/Cmd + Shift + C: Open slash commands manager
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            showSlashCommandsManager();
        }
    });

    // --- Slash Commands Helper Functions ---
    function handleInputChange() {
        const value = chatInput.value;
        const cursorPos = chatInput.selectionStart;

        // Find if we're typing a slash command
        const beforeCursor = value.substring(0, cursorPos);
        const slashMatch = beforeCursor.match(/\/(\w*)$/);

        if (slashMatch) {
            const query = slashMatch[1].toLowerCase();
            showSlashCommandsDropdown(query);
        } else {
            hideSlashCommandsDropdown();
        }
    }

    function handleInputKeydown(e) {
        const isDropdownVisible = slashCommandsDropdown.style.display === 'block';

        if (isDropdownVisible) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedCommandIndex = Math.min(selectedCommandIndex + 1, filteredCommands.length - 1);
                updateDropdownSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedCommandIndex = Math.max(selectedCommandIndex - 1, -1);
                updateDropdownSelection();
            } else if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
                if (selectedCommandIndex >= 0 && filteredCommands[selectedCommandIndex]) {
                    e.preventDefault();
                    selectSlashCommand(filteredCommands[selectedCommandIndex]);
                } else if (filteredCommands.length === 1) {
                    // Auto-select if there's only one match
                    e.preventDefault();
                    selectSlashCommand(filteredCommands[0]);
                } else if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    hideSlashCommandsDropdown();
                    handleChat();
                } else if (e.key === ' ') {
                    // For space, try to find exact match
                    const currentValue = chatInput.value;
                    const cursorPos = chatInput.selectionStart;
                    const beforeCursor = currentValue.substring(0, cursorPos);
                    const slashMatch = beforeCursor.match(/\/(\w+)$/);

                    if (slashMatch) {
                        const typedCommand = '/' + slashMatch[1];
                        const exactMatch = filteredCommands.find(([key]) => key.toLowerCase() === typedCommand.toLowerCase());

                        if (exactMatch) {
                            e.preventDefault();
                            selectSlashCommand(exactMatch);
                            // Add the space after expansion
                            setTimeout(() => {
                                chatInput.value += ' ';
                                chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
                            }, 0);
                        }
                    }
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                hideSlashCommandsDropdown();
            }
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    }

    function showSlashCommandsDropdown(query = '') {
        const allCommands = getAllSlashCommands();
        filteredCommands = Object.entries(allCommands).filter(([key, value]) =>
            key.toLowerCase().includes(query) || value.toLowerCase().includes(query)
        );

        if (filteredCommands.length === 0) {
            hideSlashCommandsDropdown();
            return;
        }

        // Auto-select first match if there's an exact match or if query is not empty
        selectedCommandIndex = query ? 0 : -1;

        slashCommandsDropdown.innerHTML = filteredCommands.map(([key, value]) => `
            <div class="slash-command-item" data-command="${key}">
                <span class="slash-command-key">${key}</span>
                <span class="slash-command-value">${value}</span>
            </div>
        `).join('');

        // Add click handlers
        slashCommandsDropdown.querySelectorAll('.slash-command-item').forEach((item, index) => {
            item.onclick = () => selectSlashCommand(filteredCommands[index]);
        });

        slashCommandsDropdown.style.display = 'block';
        updateDropdownSelection();
    }

    function hideSlashCommandsDropdown() {
        slashCommandsDropdown.style.display = 'none';
        selectedCommandIndex = -1;
        filteredCommands = [];
    }

    function updateDropdownSelection() {
        const items = slashCommandsDropdown.querySelectorAll('.slash-command-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedCommandIndex);
        });
    }

    function selectSlashCommand([key, value]) {
        const currentValue = chatInput.value;
        const cursorPos = chatInput.selectionStart;
        const beforeCursor = currentValue.substring(0, cursorPos);
        const afterCursor = currentValue.substring(cursorPos);

        // Find the slash command to replace
        const slashMatch = beforeCursor.match(/\/\w*$/);
        if (slashMatch) {
            const newBeforeCursor = beforeCursor.substring(0, slashMatch.index);
            chatInput.value = newBeforeCursor + value + afterCursor;

            // Position cursor after the inserted text
            const newCursorPos = newBeforeCursor.length + value.length;
            chatInput.setSelectionRange(newCursorPos, newCursorPos);
        }

        hideSlashCommandsDropdown();
        chatInput.focus();
    }

    function processSlashCommands(text) {
        const allCommands = getAllSlashCommands();
        let processedText = text;

        // Replace any remaining slash commands that weren't selected from dropdown
        Object.entries(allCommands).forEach(([key, value]) => {
            const regex = new RegExp(`\\${key}\\b`, 'gi');
            processedText = processedText.replace(regex, value);
        });

        return processedText;
    }

    // --- Helper Functions ---
    function getGreetingMessage() {
        const greetings = [
            "What's on your mind about this video?",
            "Ready to dive in? Ask me for a summary, key points, or anything else.",
            "I'm ready to help you with this video. What would you like to know?",
            "I've got the video context. Ask me to summarize, explain a topic, or find key moments."
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    function resetChat() {
        chatHistory = [];
        chatDisplay.innerHTML = '';
        appendChatMessage(getGreetingMessage(), 'ai');
        displaySuggestedPrompts();
    }

    function updateRegenerateButtonVisibility() {
        // Remove regenerate button from all messages
        const allRegenerateButtons = chatDisplay.querySelectorAll('.message-actions');
        allRegenerateButtons.forEach(actions => actions.remove());

        // Find the last AI message that's not a system message
        const aiMessages = chatDisplay.querySelectorAll('.chat-message.ai');
        if (aiMessages.length > 0) {
            const lastAiMessage = aiMessages[aiMessages.length - 1];
            const bubble = lastAiMessage.querySelector('.chat-bubble');
            const text = bubble.textContent || bubble.innerText;

            // Only add regenerate button if it's not a system message and has content
            if (text && !text.startsWith('🎬') && text.trim() !== '' && !text.includes("What's on your mind")) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'message-actions';

                const regenerateBtn = document.createElement('button');
                regenerateBtn.className = 'regenerate-btn';
                regenerateBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                        <path d="M3 21v-5h5"></path>
                    </svg>
                    Regenerate
                `;
                regenerateBtn.title = 'Regenerate response';
                regenerateBtn.onclick = () => regenerateLastResponse(lastAiMessage);

                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                    Copy
                `;
                copyBtn.title = 'Copy message';
                copyBtn.onclick = () => copyMessage(lastAiMessage, copyBtn);

                actionsDiv.appendChild(regenerateBtn);
                actionsDiv.appendChild(copyBtn);
                lastAiMessage.appendChild(actionsDiv);
            }
        }
    }

    async function regenerateLastResponse(messageElement) {
        // If the last message in history is an assistant response (successful or error), pop it.
        if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'assistant') {
            chatHistory.pop();
        }

        // Now the last message in history should be the user message we want to retry.
        const lastUserMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
        if (!lastUserMessage || lastUserMessage.role !== 'user') {
            console.error("Could not find user message to regenerate from.");
            const btn = messageElement.querySelector('.regenerate-btn');
            if (btn) {
                btn.textContent = 'Error: No prompt found';
                btn.disabled = true;
            }
            return;
        }

        // The history for the AI call is everything *before* this last user message.
        const historyForAI = chatHistory.slice(0, -1);

        // Disable the regenerate button to prevent multiple clicks
        const regenerateBtn = messageElement.querySelector('.regenerate-btn');
        if (regenerateBtn) {
            regenerateBtn.disabled = true;
            regenerateBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                </svg>
                Regenerating...
            `;
        }

        // Get transcript
        let transcript = '';
        if (videoContextEnabled) {
            transcript = getTranscriptText();
            if (!transcript) {
                appendChatMessage("⚠️ Could not access the transcript for regeneration.", 'ai');
                return;
            }
        }

        // Check if AI provider is configured
        const provider = settingsManager.get('aiProvider');
        const isConfigured = checkAIProviderConfiguration(provider);

        if (!isConfigured) {
            appendChatMessage("⚠️ AI provider not configured. Please go to Settings and add your API key.", 'ai');
            return;
        }

        // Remove the old AI message element
        messageElement.remove();

        // Show typing indicator
        const typingIndicator = appendTypingIndicator();
        let fullResponse = '';

        try {
            // Get new response from AI
            const responseStream = await aiService.sendMessage(
                transcript,
                lastUserMessage.content,
                historyForAI.slice(-settingsManager.get('maxChatHistory'))
            );

            // Remove typing indicator and add new AI response bubble
            typingIndicator.remove();
            const aiBubble = appendChatMessage('', 'ai', true); // Mark as regenerating to avoid adding another regenerate button initially

            // Handle streaming response
            for await (const chunk of responseStream) {
                fullResponse += chunk;
                aiBubble.innerHTML = parseMarkdown(fullResponse);

                // Only auto-scroll if user hasn't manually scrolled up and auto-scroll is enabled
                if (settingsManager.get('autoScrollToBottom') && autoScrollEnabled && !isUserScrolling) {
                    chatDisplay.scrollTop = chatDisplay.scrollHeight;
                }

                // Add typing delay if configured
                const typingSpeed = settingsManager.get('typingSpeed');
                if (typingSpeed > 0) {
                    await new Promise(resolve => setTimeout(resolve, typingSpeed));
                }
            }

            // Add new AI response to history
            chatHistory.push({ role: 'assistant', content: fullResponse });

            // Update regenerate button visibility
            updateRegenerateButtonVisibility();

        } catch (err) {
            // Remove typing indicator on error
            typingIndicator.remove();
            const errorMessage = `❌ Error regenerating response: ${err.message}`;
            appendChatMessage(errorMessage, 'ai');
            chatHistory.push({ role: 'assistant', content: errorMessage, error: true });


            // Keep regenerate button available even after error
            updateRegenerateButtonVisibility();
        }
    }

    function copyMessage(messageElement, copyBtn) {
        const bubble = messageElement.querySelector('.chat-bubble');
        const text = bubble.textContent || bubble.innerText;

        // Use the modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess(copyBtn);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                fallbackCopyTextToClipboard(text, copyBtn);
            });
        } else {
            // Fallback for older browsers or non-secure contexts
            fallbackCopyTextToClipboard(text, copyBtn);
        }
    }

    function fallbackCopyTextToClipboard(text, copyBtn) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopySuccess(copyBtn);
            } else {
                console.error('Fallback: Could not copy text');
            }
        } catch (err) {
            console.error('Fallback: Could not copy text: ', err);
        }

        document.body.removeChild(textArea);
    }

    function showCopySuccess(copyBtn) {
        const originalHTML = copyBtn.innerHTML;
        const originalClass = copyBtn.className;

        copyBtn.className = 'copy-btn copied';
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
            </svg>
            Copied!
        `;

        setTimeout(() => {
            copyBtn.className = originalClass;
            copyBtn.innerHTML = originalHTML;
        }, 2000);
    }

    function displaySuggestedPrompts() {
        suggestedPromptsContainer.innerHTML = ''; // Clear existing suggestions
        suggestedPromptsContainer.style.display = 'flex'; // Ensure it's visible
        const defaultPrompts = [
            "Summarize this video",
            "What are the key takeaways?",
            "What is the main topic?"
        ];

        defaultPrompts.forEach(prompt => {
            const button = document.createElement('button');
            button.className = 'suggested-prompt-button';
            button.textContent = prompt;
            suggestedPromptsContainer.appendChild(button);
        });
    }

    function hideSuggestedPrompts() {
        suggestedPromptsContainer.style.display = 'none';
    }

    function parseMarkdown(text) {
        let html = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        html = html.replace(/^\s*[\*\-\+]\s+(.*)/gm, '<ul><li>$1</li></ul>').replace(/<\/ul>\n?<ul>/g, '');
        html = html.replace(/^###\s+(.*)/gm, '<h3>$1</h3>').replace(/^##\s+(.*)/gm, '<h2>$1</h2>').replace(/^#\s+(.*)/gm, '<h1>$1</h1>');
        html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>').replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');

        // Enhanced timestamp parsing with better validation and formatting
        html = html.replace(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]|\b(\d{1,2}:\d{2}(?::\d{2})?)\b/g, (match, bracketed, unbracketed) => {
            const timestamp = bracketed || unbracketed;
            const parts = timestamp.split(':').map(Number);
            let seconds = 0;
            let isValid = false;

            // Validate timestamp format
            if (parts.length === 3) { // HH:MM:SS
                if (parts[0] >= 0 && parts[1] >= 0 && parts[1] < 60 && parts[2] >= 0 && parts[2] < 60) {
                    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                    isValid = true;
                }
            } else if (parts.length === 2) { // MM:SS
                if (parts[0] >= 0 && parts[1] >= 0 && parts[1] < 60) {
                    seconds = parts[0] * 60 + parts[1];
                    isValid = true;
                }
            }

            // Only create clickable links for valid timestamps
            if (isValid) {
                return `<a href="#" class="yt-timestamp-link" data-seconds="${seconds}">${timestamp}</a>`;
            }
            return match; // Return original if invalid
        });

        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function getTranscriptText() {
        const segments = document.querySelectorAll('ytd-transcript-segment-renderer .segment');
        if (segments.length === 0) { return null; }
        return Array.from(segments).map(el => el.innerText.trim()).join(' ');
    }

    function getTimestampContext(timestamp, transcript) {
        if (!transcript || !settingsManager.get('enhancedTimestamps')) return '';

        // Find the context around the timestamp in the transcript
        const timestampIndex = transcript.indexOf(timestamp);
        if (timestampIndex === -1) return '';

        // Get ~50 characters before and after the timestamp
        const start = Math.max(0, timestampIndex - 50);
        const end = Math.min(transcript.length, timestampIndex + timestamp.length + 100);
        const context = transcript.substring(start, end).trim();

        // Clean up the context
        return context.replace(/\s+/g, ' ').substring(0, 150) + (context.length > 150 ? '...' : '');
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
        let message = chatInput.value.trim();
        if (!message) return;

        // Process slash commands
        message = processSlashCommands(message);

        let transcript = '';
        if (videoContextEnabled) {
            transcript = getTranscriptText();
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

        // Hide suggestion buttons after first user message
        hideSuggestedPrompts();

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

                // Only auto-scroll if user hasn't manually scrolled up and auto-scroll is enabled
                if (settingsManager.get('autoScrollToBottom') && autoScrollEnabled && !isUserScrolling) {
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

            // Update regenerate button visibility (only show on last AI message)
            updateRegenerateButtonVisibility();
        } catch (err) {
            // Remove typing indicator on error
            typingIndicator.remove();
            appendChatMessage(`❌ Error: ${err.message}`, 'ai');

            // Keep regenerate button available even after error
            updateRegenerateButtonVisibility();
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
            case 'openrouter':
                return !!settingsManager.get('openrouterApiKey');
            default:
                return false;
        }
    }



    function appendChatMessage(text, sender, isRegenerating = false) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${sender}`;

        // Add username for AI messages
        if (sender === 'ai') {
            const usernameEl = document.createElement('div');
            usernameEl.className = 'chat-username';
            usernameEl.textContent = 'chep';
            messageEl.appendChild(usernameEl);
        }

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'chat-bubble';

        if (sender === 'ai') {
            bubbleEl.innerHTML = `${parseMarkdown(text)}`;
        } else {
            bubbleEl.textContent = text;
        }

        messageEl.appendChild(bubbleEl);
        chatDisplay.appendChild(messageEl);

        // Only auto-scroll if user hasn't manually scrolled up
        if (autoScrollEnabled && !isUserScrolling) {
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }

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

        // Only auto-scroll if user hasn't manually scrolled up
        if (autoScrollEnabled && !isUserScrolling) {
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }

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

        // Only auto-scroll if user hasn't manually scrolled up
        if (autoScrollEnabled && !isUserScrolling) {
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }

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
                appendChatMessage(getGreetingMessage(), 'ai');
            } else {
                appendChatMessage("⚠️ Couldn't access the transcript automatically. Please open it manually by clicking the three-dot menu (...) below the video and selecting 'Show transcript'.", 'ai');
            }
        } else {
            // Transcript already available
            appendChatMessage(getGreetingMessage(), 'ai');
        }
        displaySuggestedPrompts();
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

// --- Mini LLM Popup Feature ---
function initializeMiniLLMPopup(settingsManager, aiService, getTranscriptText) {
    let miniPopup = null;
    let selectedText = '';
    let isPopupVisible = false;
    let hideTimeout = null;

    // Clean up any existing popup first
    const existingPopup = document.querySelector('.mini-llm-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create popup styles
    const popupStyle = document.createElement('style');
    popupStyle.textContent = `
        .mini-llm-popup {
            position: fixed;
            background: #1a1a1a;
            border: 1px solid #3ea6ff;
            border-radius: 8px;
            padding: 8px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(62, 166, 255, 0.2);
            font-family: 'Roboto', Arial, sans-serif;
            font-size: 13px;
            color: #ffffff;
            backdrop-filter: blur(10px);
            max-width: 300px;
            opacity: 0;
            transform: translateY(-5px);
            transition: all 0.2s ease;
            pointer-events: none;
        }
        .mini-llm-popup.visible {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        .mini-llm-popup-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(62, 166, 255, 0.2);
        }
        .mini-llm-popup-logo {
            width: 16px;
            height: 16px;
            opacity: 0.9;
        }
        .mini-llm-popup-title {
            font-size: 12px;
            font-weight: 500;
            color: #3ea6ff;
        }
        .mini-llm-popup-context-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            margin: 4px 0;
        }
        .mini-llm-popup-context-label {
            font-size: 12px;
            color: #ffffff;
            font-weight: 500;
        }
        .context-toggle-switch {
            position: relative;
            width: 32px;
            height: 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid rgba(62, 166, 255, 0.3);
        }
        .context-toggle-switch.enabled {
            background: rgba(62, 166, 255, 0.3);
            border-color: rgba(62, 166, 255, 0.6);
        }
        .context-toggle-slider {
            position: absolute;
            top: 1px;
            left: 1px;
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-radius: 50%;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .context-toggle-switch.enabled .context-toggle-slider {
            transform: translateX(16px);
            background: #3ea6ff;
        }
        .mini-llm-popup-buttons {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .mini-llm-popup-input-container {
            display: flex;
            gap: 6px;
            margin-bottom: 8px;
        }
        .mini-llm-popup-input {
            flex: 1;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(62, 166, 255, 0.3);
            color: #ffffff;
            padding: 6px 8px;
            border-radius: 4px;
            font-size: 12px;
            outline: none;
            transition: all 0.2s ease;
        }
        .mini-llm-popup-input:focus {
            border-color: #3ea6ff;
            box-shadow: 0 0 0 1px rgba(62, 166, 255, 0.2);
        }
        .mini-llm-popup-input::placeholder {
            color: #666;
        }
        .mini-llm-popup-send {
            background: rgba(62, 166, 255, 0.2);
            border: 1px solid rgba(62, 166, 255, 0.4);
            color: #ffffff;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        .mini-llm-popup-send:hover {
            background: rgba(62, 166, 255, 0.3);
            border-color: rgba(62, 166, 255, 0.6);
        }
        .mini-llm-popup-send:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .mini-llm-popup-divider {
            height: 1px;
            background: rgba(62, 166, 255, 0.2);
            margin: 8px 0;
        }
        .mini-llm-popup-btn {
            background: rgba(62, 166, 255, 0.1);
            border: 1px solid rgba(62, 166, 255, 0.3);
            color: #ffffff;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            text-align: left;
        }
        .mini-llm-popup-btn:hover {
            background: rgba(62, 166, 255, 0.2);
            border-color: rgba(62, 166, 255, 0.5);
            transform: translateY(-1px);
        }
        .mini-llm-popup-btn:active {
            transform: translateY(0);
        }
        .mini-llm-popup-selected-text {
            background: rgba(62, 166, 255, 0.1);
            border: 1px solid rgba(62, 166, 255, 0.2);
            border-radius: 4px;
            padding: 6px;
            margin-bottom: 8px;
            font-size: 11px;
            color: #aaaaaa;
            max-height: 60px;
            overflow-y: auto;
            word-break: break-word;
        }
        .mini-llm-popup-response {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(62, 166, 255, 0.2);
            border-radius: 4px;
            padding: 8px;
            margin-top: 8px;
            font-size: 12px;
            line-height: 1.4;
            max-height: 150px;
            overflow-y: auto;
        }
        .mini-llm-popup-loading {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #aaaaaa;
            font-size: 11px;
        }
        .mini-llm-popup-spinner {
            width: 12px;
            height: 12px;
            border: 1px solid rgba(62, 166, 255, 0.3);
            border-top: 1px solid #3ea6ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(popupStyle);

    // Create popup element
    function createPopup() {
        const popup = document.createElement('div');
        popup.className = 'mini-llm-popup';
        const popupTitle = 'Mini Assistant';
        popup.innerHTML = `
            <div class="mini-llm-popup-header">
                <img src="${chrome.runtime.getURL('assets/chep-logo.png')}" alt="Chep" class="mini-llm-popup-logo">
                <span class="mini-llm-popup-title">${popupTitle}</span>
            </div>
            <div class="mini-llm-popup-selected-text"></div>
            <div class="mini-llm-popup-input-container">
                <input type="text" class="mini-llm-popup-input" placeholder="Ask about this text...">
                <button class="mini-llm-popup-send">Ask</button>
            </div>
            <div class="mini-llm-popup-context-toggle">
                <span class="mini-llm-popup-context-label">Use video context</span>
                <div class="context-toggle-switch enabled" data-context-enabled="true">
                    <div class="context-toggle-slider"></div>
                </div>
            </div>
            <div class="mini-llm-popup-divider"></div>
            <div class="mini-llm-popup-buttons">
                <button class="mini-llm-popup-btn" data-action="explain">Explain this</button>
                <button class="mini-llm-popup-btn" data-action="summarize">Summarize</button>
                <button class="mini-llm-popup-btn" data-action="translate">Translate</button>
                <button class="mini-llm-popup-btn" data-action="define">Define key terms</button>
            </div>
        `;
        document.body.appendChild(popup);

        // Add event listeners to prevent unwanted hiding
        popup.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });

        // Clear hide timeout when mouse enters popup
        popup.addEventListener('mouseenter', () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        });

        // Prevent hiding when focusing input
        const input = popup.querySelector('.mini-llm-popup-input');
        if (input) {
            input.addEventListener('focus', () => {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
            });

            input.addEventListener('blur', () => {
                // Small delay before potentially hiding
                setTimeout(() => {
                    if (!popup.matches(':hover') && !popup.contains(document.activeElement)) {
                        hideTimeout = setTimeout(hidePopup, 200);
                    }
                }, 50);
            });
        }

        return popup;
    }

    // Position popup near selection
    function positionPopup(popup, selection) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Calculate position relative to viewport (fixed positioning)
        let left = rect.left + 10; // Align with left edge of selection plus a 10px offset
        let top = rect.bottom + 10; // Position below selection

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Ensure popup is fully visible horizontally
        const popupWidth = 300; // max-width from CSS
        if (left < 10) left = 10;
        if (left + popupWidth > viewportWidth - 10) left = viewportWidth - popupWidth - 10;

        // Ensure popup is fully visible vertically
        // First, temporarily show popup to get its height
        popup.style.visibility = 'hidden';
        popup.style.display = 'block';
        const popupHeight = popup.offsetHeight;
        popup.style.visibility = '';
        popup.style.display = '';

        // Vertical adjustment - show above if not enough space below
        if (top + popupHeight > viewportHeight - 10) {
            top = rect.top - popupHeight - 10;
            // If still not enough space above, position optimally within viewport
            if (top < 10) {
                // Position popup in the middle of available space or at selection level
                const availableSpace = viewportHeight - 20; // 10px margin on each side
                if (popupHeight < availableSpace) {
                    // Center vertically around the selection if possible
                    const selectionCenter = rect.top + (rect.height / 2);
                    top = Math.max(10, Math.min(selectionCenter - (popupHeight / 2), viewportHeight - popupHeight - 10));
                } else {
                    top = 10; // Fallback to top if popup is too tall
                }
            }
        }

        // Apply fixed positioning (relative to viewport)
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    }

    // Show popup
    function showPopup(selection) {
        selectedText = selection.toString().trim();
        if (!selectedText || selectedText.length < 3) return;

        // Limit selected text length for display
        const displayText = selectedText.length > 100 ?
            selectedText.substring(0, 100) + '...' : selectedText;

        if (!miniPopup) {
            miniPopup = createPopup();
        }

        // Update selected text display
        const textDisplay = miniPopup.querySelector('.mini-llm-popup-selected-text');
        textDisplay.textContent = `"${displayText}"`;

        // Position and show popup
        positionPopup(miniPopup, selection);

        // Clear any existing timeout
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        // Show popup with animation
        setTimeout(() => {
            miniPopup.classList.add('visible');
            isPopupVisible = true;

            // Focus the input field for immediate typing without scrolling
            const input = miniPopup.querySelector('.mini-llm-popup-input');
            if (input) {
                // Prevent focus from causing scroll
                const scrollX = window.scrollX;
                const scrollY = window.scrollY;
                input.focus({ preventScroll: true });
                // Restore scroll position if it changed
                window.scrollTo(scrollX, scrollY);
            }
        }, 10);
    }

    // Hide popup
    function hidePopup() {
        if (miniPopup && isPopupVisible) {
            miniPopup.classList.remove('visible');
            isPopupVisible = false;

            // Remove response if any
            const responseDiv = miniPopup.querySelector('.mini-llm-popup-response');
            if (responseDiv) {
                responseDiv.remove();
            }
        }
    }

    // Handle AI request
    async function handleAIRequest(action, customPrompt = null) {
        if (!selectedText) return;

        // Check if AI is configured
        const provider = settingsManager.get('aiProvider');
        const isConfigured = checkAIProviderConfiguration(provider);

        if (!isConfigured) {
            showPopupResponse("⚠️ AI provider not configured. Please configure your API key in the YouTube AI Companion settings.");
            return;
        }

        // Show loading state
        showPopupLoading();

        // Check if context is enabled
        const contextToggle = miniPopup.querySelector('.context-toggle-switch');
        const isContextEnabled = contextToggle.dataset.contextEnabled === 'true';

        // Build prompt based on action or use custom prompt
        let prompt = '';
        if (customPrompt) {
            prompt = `${customPrompt}\n\nSelected text: "${selectedText}"`;
        } else {
            switch (action) {
                case 'explain':
                    prompt = `Please explain this text in simple terms: "${selectedText}"`;
                    break;
                case 'summarize':
                    prompt = `Please provide a concise summary of this text: "${selectedText}"`;
                    break;
                case 'translate':
                    prompt = `Please translate this text to English (if it's not English) or provide the meaning: "${selectedText}"`;
                    break;
                case 'define':
                    prompt = `Please define the key terms and concepts in this text: "${selectedText}"`;
                    break;
                default:
                    prompt = `Please help me understand this text: "${selectedText}"`;
            }
        }

        try {
            let contextText = '';

            if (isContextEnabled) {
                // Get video transcript if available, otherwise use simple context
                let transcript = '';
                if (window.location.href.includes('youtube.com/watch')) {
                    transcript = getTranscriptText();
                }

                contextText = transcript ?
                    `Video transcript: ${transcript}\n\nSelected text from page: "${selectedText}"` :
                    `Selected text from webpage: "${selectedText}"`;
            } else {
                // Context disabled - only use the selected text
                contextText = `Selected text: "${selectedText}"`;
            }

            const responseStream = await aiService.sendMessage(contextText, prompt, [], true); // true = mini assistant mode

            let fullResponse = '';
            const responseDiv = showPopupResponse('');

            // Handle streaming response
            for await (const chunk of responseStream) {
                fullResponse += chunk;
                responseDiv.textContent = fullResponse;

                // Auto-scroll response if needed
                if (responseDiv.scrollHeight > responseDiv.clientHeight) {
                    responseDiv.scrollTop = responseDiv.scrollHeight;
                }
            }

        } catch (error) {
            showPopupResponse(`❌ Error: ${error.message}`);
        }
    }

    // Show loading state in popup
    function showPopupLoading() {
        const buttonsDiv = miniPopup.querySelector('.mini-llm-popup-buttons');
        const inputContainer = miniPopup.querySelector('.mini-llm-popup-input-container');

        // Disable input and send button
        const input = inputContainer.querySelector('.mini-llm-popup-input');
        const sendBtn = inputContainer.querySelector('.mini-llm-popup-send');
        input.disabled = true;
        sendBtn.disabled = true;

        buttonsDiv.innerHTML = `
            <div class="mini-llm-popup-loading">
                <div class="mini-llm-popup-spinner"></div>
                <span>Thinking...</span>
            </div>
        `;
    }

    // Show response in popup
    function showPopupResponse(response) {
        // Remove loading state and restore buttons
        const buttonsDiv = miniPopup.querySelector('.mini-llm-popup-buttons');
        const inputContainer = miniPopup.querySelector('.mini-llm-popup-input-container');

        // Re-enable input and send button
        const input = inputContainer.querySelector('.mini-llm-popup-input');
        const sendBtn = inputContainer.querySelector('.mini-llm-popup-send');
        input.disabled = false;
        sendBtn.disabled = false;

        buttonsDiv.innerHTML = `
            <button class="mini-llm-popup-btn" data-action="explain">Explain this</button>
            <button class="mini-llm-popup-btn" data-action="summarize">Summarize</button>
            <button class="mini-llm-popup-btn" data-action="translate">Translate</button>
            <button class="mini-llm-popup-btn" data-action="define">Define key terms</button>
        `;

        // Add or update response div
        let responseDiv = miniPopup.querySelector('.mini-llm-popup-response');
        if (!responseDiv) {
            responseDiv = document.createElement('div');
            responseDiv.className = 'mini-llm-popup-response';
            miniPopup.appendChild(responseDiv);
        }

        responseDiv.textContent = response;
        return responseDiv;
    }

    // Check if AI provider is configured (reuse from main extension)
    function checkAIProviderConfiguration(provider) {
        switch (provider) {
            case 'openai':
                return !!settingsManager.get('openaiApiKey');
            case 'gemini':
                return !!settingsManager.get('geminiApiKey');
            case 'openrouter':
                return !!settingsManager.get('openrouterApiKey');
            default:
                return false;
        }
    }

    // Event listeners
    document.addEventListener('mouseup', (e) => {
        // Small delay to ensure selection is complete
        setTimeout(() => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && !selection.isCollapsed) {
                // Check if selection is not inside the popup itself
                if (!miniPopup || !miniPopup.contains(e.target)) {
                    showPopup(selection);
                }
            }
        }, 10);
    });

    // Hide popup when double-clicking elsewhere (prevents accidental dismissal)
    let clickCount = 0;
    let clickTimer = null;
    let lastClickTime = 0;

    document.addEventListener('mousedown', (e) => {
        if (miniPopup && !miniPopup.contains(e.target) && isPopupVisible) {
            // Only hide if clicking far from the popup
            const popupRect = miniPopup.getBoundingClientRect();
            const clickX = e.clientX;
            const clickY = e.clientY;

            // Add buffer zone around popup (30px for more tolerance)
            const buffer = 30;
            const isNearPopup = clickX >= popupRect.left - buffer &&
                clickX <= popupRect.right + buffer &&
                clickY >= popupRect.top - buffer &&
                clickY <= popupRect.bottom + buffer;

            if (!isNearPopup) {
                const currentTime = Date.now();
                const timeDiff = currentTime - lastClickTime;

                // Reset click count if too much time has passed (500ms)
                if (timeDiff > 500) {
                    clickCount = 0;
                }

                clickCount++;
                lastClickTime = currentTime;

                // Clear existing timer
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                }

                // Only hide on double-click
                if (clickCount >= 2) {
                    const selection = window.getSelection();
                    if (selection.isCollapsed) {
                        hideTimeout = setTimeout(hidePopup, 100); // Quick hide on double-click
                    }
                    clickCount = 0; // Reset after double-click
                } else {
                    // Reset click count after timeout if no second click
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                    }, 500);
                }
            }
        }
    });



    // Handle button clicks and input
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('mini-llm-popup-btn')) {
            e.preventDefault();
            e.stopPropagation();

            // Clear hide timeout if set
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            const action = e.target.dataset.action;
            handleAIRequest(action);
        }

        if (e.target.classList.contains('mini-llm-popup-send')) {
            e.preventDefault();
            e.stopPropagation();

            // Clear hide timeout if set
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            const input = miniPopup.querySelector('.mini-llm-popup-input');
            const customPrompt = input.value.trim();

            if (customPrompt) {
                handleAIRequest(null, customPrompt);
                input.value = ''; // Clear input after sending
            }
        }

        // Handle context toggle
        if (e.target.classList.contains('context-toggle-switch') || e.target.closest('.context-toggle-switch')) {
            e.preventDefault();
            e.stopPropagation();

            // Clear hide timeout if set
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            const toggleSwitch = e.target.classList.contains('context-toggle-switch') ?
                e.target : e.target.closest('.context-toggle-switch');

            const isCurrentlyEnabled = toggleSwitch.dataset.contextEnabled === 'true';
            const newState = !isCurrentlyEnabled;

            // Update toggle state
            toggleSwitch.dataset.contextEnabled = newState.toString();

            if (newState) {
                toggleSwitch.classList.add('enabled');
            } else {
                toggleSwitch.classList.remove('enabled');
            }

            // Optional: Show brief feedback about the toggle state
            const label = miniPopup.querySelector('.mini-llm-popup-context-label');
            const originalText = label.textContent;
            label.textContent = newState ? 'Context ON' : 'Context OFF';
            label.style.color = newState ? '#4ade80' : '#f87171';

            setTimeout(() => {
                label.textContent = originalText;
                label.style.color = '#aaaaaa';
            }, 1000);
        }
    });

    // Handle Enter key in input field
    document.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('mini-llm-popup-input') && e.key === 'Enter') {
            e.preventDefault();
            const sendBtn = miniPopup.querySelector('.mini-llm-popup-send');
            sendBtn.click();
        }

        if (e.key === 'Escape' && isPopupVisible) {
            hidePopup();
        }
    });

    // Hide popup when selection changes (but not when interacting with popup)
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection.isCollapsed && isPopupVisible) {
            // Don't hide if user is interacting with the popup
            if (miniPopup && (miniPopup.contains(document.activeElement) || miniPopup.matches(':hover'))) {
                return;
            }
            // Longer delay to prevent accidental hiding
            hideTimeout = setTimeout(hidePopup, 1000);
        }
    });


}
