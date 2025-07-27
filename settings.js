// Settings management for the AI Assistant extension
class SettingsManager {
    constructor() {
        this.defaultSettings = {
            theme: 'dark',
            autoOpenTranscript: true,
            chatHeight: 280,
            expandedChatHeight: 'calc(100vh - 140px)',
            fontSize: 14,
            expandedFontSize: 16,
            enableTimestampLinks: true,
            typingSpeed: 50, // milliseconds delay between chunks
            maxChatHistory: 50,
            showLoadingAnimations: true,
            autoScrollToBottom: true,
            compactMode: false,
            enableKeyboardShortcuts: true,
            soundNotifications: false,
            // AI Provider Settings
            aiProvider: 'openai', // openai, gemini, openrouter
            openaiApiKey: '',
            openaiModel: 'gpt-4o-mini',
            geminiApiKey: '',
            geminiModel: 'gemini-1.5-flash',
            openrouterApiKey: '',
            openrouterModel: 'google/gemini-flash-1.5',
        };
        this.settings = { ...this.defaultSettings };
        this.loadSettings();
    }

    // Load settings from localStorage
    loadSettings() {
        try {
            const saved = localStorage.getItem('ai-assistant-settings');
            if (saved) {
                this.settings = { ...this.defaultSettings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
            this.settings = { ...this.defaultSettings };
        }
    }

    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('ai-assistant-settings', JSON.stringify(this.settings));
            this.applySettings();
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    // Get a specific setting value
    get(key) {
        return this.settings[key];
    }

    // Set a specific setting value
    set(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    // Reset to default settings
    reset() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
    }

    // Apply settings to the UI
    applySettings() {
        const container = document.getElementById('ai-companion-container-ext');
        if (!container) return;

        // Apply theme
        container.setAttribute('data-theme', this.settings.theme);

        // Apply chat height
        const chatDisplay = document.getElementById('chat-display-ext');
        if (chatDisplay) {
            if (container.classList.contains('expanded')) {
                chatDisplay.style.height = this.settings.expandedChatHeight;
                chatDisplay.style.fontSize = this.settings.expandedFontSize + 'px';
            } else {
                chatDisplay.style.height = this.settings.chatHeight + 'px';
                chatDisplay.style.fontSize = this.settings.fontSize + 'px';
            }
        }

        // Apply compact mode
        if (this.settings.compactMode) {
            container.classList.add('compact-mode');
        } else {
            container.classList.remove('compact-mode');
        }

        // Dispatch settings change event
        window.dispatchEvent(new CustomEvent('ai-settings-changed', { 
            detail: this.settings 
        }));
    }

    // Create settings modal
    createSettingsModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('ai-settings-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'ai-settings-modal';
        modal.innerHTML = `
            <div class="settings-overlay">
                <div class="settings-modal">
                    <div class="settings-header">
                        <h2>AI Assistant Settings</h2>
                        <button class="settings-close-btn" title="Close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="settings-content">
                        <div class="settings-section">
                            <h3>Appearance</h3>
                            <div class="setting-item">
                                <label for="theme-select">Theme:</label>
                                <select id="theme-select">
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label for="font-size-slider">Font Size:</label>
                                <input type="range" id="font-size-slider" min="12" max="20" value="${this.settings.fontSize}">
                                <span class="setting-value">${this.settings.fontSize}px</span>
                            </div>
                            <div class="setting-item">
                                <label for="compact-mode-toggle">Compact Mode:</label>
                                <input type="checkbox" id="compact-mode-toggle" ${this.settings.compactMode ? 'checked' : ''}>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3>Chat Behavior</h3>
                            <div class="setting-item">
                                <label for="auto-open-transcript-toggle">Auto-open Transcript:</label>
                                <input type="checkbox" id="auto-open-transcript-toggle" ${this.settings.autoOpenTranscript ? 'checked' : ''}>
                            </div>
                            <div class="setting-item">
                                <label for="chat-height-slider">Chat Height:</label>
                                <input type="range" id="chat-height-slider" min="200" max="500" value="${this.settings.chatHeight}">
                                <span class="setting-value">${this.settings.chatHeight}px</span>
                            </div>
                            <div class="setting-item">
                                <label for="typing-speed-slider">Typing Speed:</label>
                                <input type="range" id="typing-speed-slider" min="10" max="200" value="${this.settings.typingSpeed}">
                                <span class="setting-value">${this.settings.typingSpeed}ms</span>
                            </div>
                            <div class="setting-item">
                                <label for="max-history-slider">Max Chat History:</label>
                                <input type="range" id="max-history-slider" min="10" max="100" value="${this.settings.maxChatHistory}">
                                <span class="setting-value">${this.settings.maxChatHistory}</span>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3>Features</h3>
                            <div class="setting-item">
                                <label for="timestamp-links-toggle">Enable Timestamp Links:</label>
                                <input type="checkbox" id="timestamp-links-toggle" ${this.settings.enableTimestampLinks ? 'checked' : ''}>
                            </div>
                            <div class="setting-item">
                                <label for="loading-animations-toggle">Show Loading Animations:</label>
                                <input type="checkbox" id="loading-animations-toggle" ${this.settings.showLoadingAnimations ? 'checked' : ''}>
                            </div>
                            <div class="setting-item">
                                <label for="auto-scroll-toggle">Auto-scroll to Bottom:</label>
                                <input type="checkbox" id="auto-scroll-toggle" ${this.settings.autoScrollToBottom ? 'checked' : ''}>
                            </div>
                            <div class="setting-item">
                                <label for="keyboard-shortcuts-toggle">Enable Keyboard Shortcuts:</label>
                                <input type="checkbox" id="keyboard-shortcuts-toggle" ${this.settings.enableKeyboardShortcuts ? 'checked' : ''}>
                            </div>
                            <div class="setting-item">
                                <label for="sound-notifications-toggle">Sound Notifications:</label>
                                <input type="checkbox" id="sound-notifications-toggle" ${this.settings.soundNotifications ? 'checked' : ''}>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3>AI Configuration</h3>
                            <div class="setting-item">
                                <label for="ai-provider-select">AI Provider:</label>
                                <select id="ai-provider-select">
                                    <option value="openai">OpenAI</option>
                                    <option value="gemini">Google Gemini</option>
                                    <option value="openrouter">OpenRouter</option>
                                </select>
                            </div>
                            
                            <!-- OpenAI Settings -->
                            <div id="openai-settings" class="provider-settings">
                                <div class="setting-item">
                                    <label for="openai-api-key">OpenAI API Key:</label>
                                    <input type="password" id="openai-api-key" value="${this.settings.openaiApiKey}" placeholder="sk-...">
                                </div>
                                <div class="setting-item">
                                    <label for="openai-model">Model:</label>
                                    <select id="openai-model">
                                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                                        <option value="gpt-4o">GPT-4o</option>
                                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Gemini Settings -->
                            <div id="gemini-settings" class="provider-settings">
                                <div class="setting-item">
                                    <label for="gemini-api-key">Gemini API Key:</label>
                                    <input type="password" id="gemini-api-key" value="${this.settings.geminiApiKey}" placeholder="AI...">
                                </div>
                                <div class="setting-item">
                                    <label for="gemini-model">Model:</label>
                                    <select id="gemini-model">
                                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                                        <option value="gemini-pro">Gemini Pro</option>
                                    </select>
                                </div>
                            </div>

                            <!-- OpenRouter Settings -->
                            <div id="openrouter-settings" class="provider-settings">
                                <div class="setting-item">
                                    <label for="openrouter-api-key">OpenRouter API Key:</label>
                                    <input type="password" id="openrouter-api-key" value="${this.settings.openrouterApiKey}" placeholder="sk-or-...">
                                </div>
                                <div class="setting-item">
                                    <label for="openrouter-model">Model:</label>
                                    <input type="text" id="openrouter-model" value="${this.settings.openrouterModel}" placeholder="google/gemini-flash-1.5">
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="settings-footer">
                        <button class="settings-reset-btn">Reset to Defaults</button>
                        <div class="settings-actions">
                            <button class="settings-cancel-btn">Cancel</button>
                            <button class="settings-save-btn">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            #ai-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 10000;
                font-family: 'Roboto', Arial, sans-serif;
            }

            .settings-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(4px);
            }

            .settings-modal {
                background: var(--yt-spec-background-elevation-1, #212121);
                border-radius: 12px;
                border: 1px solid var(--yt-spec-border-color, #535353);
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }

            .settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid var(--yt-spec-border-color, #535353);
                background: linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(62, 166, 255, 0.08));
            }

            .settings-header h2 {
                margin: 0;
                color: var(--yt-spec-text-primary, #ffffff);
                font-size: 20px;
                font-weight: 500;
            }

            .settings-close-btn {
                background: none;
                border: none;
                color: var(--yt-spec-text-secondary, #aaaaaa);
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .settings-close-btn:hover {
                background: var(--yt-spec-background-elevation-2, #3f3f3f);
                color: var(--yt-spec-text-primary, #ffffff);
            }

            .settings-content {
                padding: 24px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .settings-section {
                margin-bottom: 32px;
            }

            .settings-section:last-child {
                margin-bottom: 0;
            }

            .settings-section h3 {
                margin: 0 0 16px 0;
                color: var(--yt-spec-text-primary, #ffffff);
                font-size: 16px;
                font-weight: 500;
                border-bottom: 1px solid var(--yt-spec-border-color, #535353);
                padding-bottom: 8px;
            }

            .setting-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                gap: 16px;
            }

            .setting-item label {
                color: var(--yt-spec-text-primary, #ffffff);
                font-size: 14px;
                flex: 1;
            }

            .setting-item select,
            .setting-item input[type="text"] {
                background: var(--yt-spec-background-elevation-2, #3f3f3f);
                border: 1px solid var(--yt-spec-border-color, #535353);
                color: var(--yt-spec-text-primary, #ffffff);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                min-width: 120px;
            }

            .setting-item input[type="range"] {
                min-width: 100px;
                margin-right: 8px;
            }

            .setting-item input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: var(--yt-spec-blue-text, #3ea6ff);
            }

            .setting-value {
                color: var(--yt-spec-text-secondary, #aaaaaa);
                font-size: 12px;
                min-width: 40px;
                text-align: right;
            }

            .settings-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-top: 1px solid var(--yt-spec-border-color, #535353);
                background: var(--yt-spec-background-elevation-2, #3f3f3f);
            }

            .settings-reset-btn {
                background: none;
                border: 1px solid var(--yt-spec-border-color, #535353);
                color: var(--yt-spec-text-secondary, #aaaaaa);
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .settings-reset-btn:hover {
                background: var(--yt-spec-background-elevation-1, #212121);
                color: var(--yt-spec-text-primary, #ffffff);
            }

            .settings-actions {
                display: flex;
                gap: 12px;
            }

            .settings-cancel-btn,
            .settings-save-btn {
                padding: 8px 20px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
            }

            .settings-cancel-btn {
                background: var(--yt-spec-background-elevation-1, #212121);
                color: var(--yt-spec-text-secondary, #aaaaaa);
                border: 1px solid var(--yt-spec-border-color, #535353);
            }

            .settings-cancel-btn:hover {
                background: var(--yt-spec-background-elevation-2, #3f3f3f);
                color: var(--yt-spec-text-primary, #ffffff);
            }

            .settings-save-btn {
                background: linear-gradient(135deg, #0066ff, #3ea6ff);
                color: white;
                box-shadow: 0 0 20px rgba(0, 102, 255, 0.3);
            }

            .settings-save-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 0 25px rgba(0, 102, 255, 0.4), 0 4px 15px rgba(0, 0, 0, 0.2);
            }

            /* Compact mode styles */
            #ai-companion-container-ext.compact-mode .ai-header {
                padding: 8px 12px;
            }

            #ai-companion-container-ext.compact-mode .ai-header-title {
                font-size: 16px;
            }

            #ai-companion-container-ext.compact-mode .ai-panel {
                padding: 12px;
            }

            #ai-companion-container-ext.compact-mode #chat-display-ext {
                height: 200px;
            }

            /* Provider settings styles */
            .provider-settings {
                margin-left: 20px;
                border-left: 2px solid var(--yt-spec-border-color, #535353);
                padding-left: 16px;
                margin-top: 12px;
            }

            .provider-settings.hidden {
                display: none;
            }

            .setting-item input[type="password"] {
                background: var(--yt-spec-background-elevation-2, #3f3f3f);
                border: 1px solid var(--yt-spec-border-color, #535353);
                color: var(--yt-spec-text-primary, #ffffff);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                min-width: 200px;
            }

            .setting-item input[type="password"]:focus,
            .setting-item input[type="text"]:focus,
            .setting-item select:focus {
                outline: none;
                border-color: var(--yt-spec-blue-text, #3ea6ff);
                box-shadow: 0 0 0 2px rgba(62, 166, 255, 0.2);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Set current values
        document.getElementById('theme-select').value = this.settings.theme;
        document.getElementById('font-size-slider').value = this.settings.fontSize;
        document.getElementById('compact-mode-toggle').checked = this.settings.compactMode;
        document.getElementById('auto-open-transcript-toggle').checked = this.settings.autoOpenTranscript;
        document.getElementById('chat-height-slider').value = this.settings.chatHeight;
        document.getElementById('typing-speed-slider').value = this.settings.typingSpeed;
        document.getElementById('max-history-slider').value = this.settings.maxChatHistory;
        document.getElementById('timestamp-links-toggle').checked = this.settings.enableTimestampLinks;
        document.getElementById('loading-animations-toggle').checked = this.settings.showLoadingAnimations;
        document.getElementById('auto-scroll-toggle').checked = this.settings.autoScrollToBottom;
        document.getElementById('keyboard-shortcuts-toggle').checked = this.settings.enableKeyboardShortcuts;
        document.getElementById('sound-notifications-toggle').checked = this.settings.soundNotifications;
        
        // Set AI provider values
        document.getElementById('ai-provider-select').value = this.settings.aiProvider;
        document.getElementById('openai-api-key').value = this.settings.openaiApiKey;
        document.getElementById('openai-model').value = this.settings.openaiModel;
        document.getElementById('gemini-api-key').value = this.settings.geminiApiKey;
        document.getElementById('gemini-model').value = this.settings.geminiModel;
        document.getElementById('openrouter-api-key').value = this.settings.openrouterApiKey;
        document.getElementById('openrouter-model').value = this.settings.openrouterModel;
        
        // Show/hide provider settings based on selection
        this.updateProviderVisibility(this.settings.aiProvider);

        // Add event listeners
        this.attachModalEventListeners(modal);

        return modal;
    }

    attachModalEventListeners(modal) {
        // Close modal
        const closeBtn = modal.querySelector('.settings-close-btn');
        const cancelBtn = modal.querySelector('.settings-cancel-btn');
        const overlay = modal.querySelector('.settings-overlay');

        const closeModal = () => modal.remove();

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Update value displays for sliders
        const updateSliderDisplay = (slider, valueSpan) => {
            slider.addEventListener('input', () => {
                valueSpan.textContent = slider.value + (slider.id.includes('font-size') || slider.id.includes('chat-height') ? 'px' : 
                                                       slider.id.includes('typing-speed') ? 'ms' : '');
            });
        };

        updateSliderDisplay(modal.querySelector('#font-size-slider'), modal.querySelector('#font-size-slider + .setting-value'));
        updateSliderDisplay(modal.querySelector('#chat-height-slider'), modal.querySelector('#chat-height-slider + .setting-value'));
        updateSliderDisplay(modal.querySelector('#typing-speed-slider'), modal.querySelector('#typing-speed-slider + .setting-value'));
        updateSliderDisplay(modal.querySelector('#max-history-slider'), modal.querySelector('#max-history-slider + .setting-value'));

        // Reset button
        modal.querySelector('.settings-reset-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all settings to defaults?')) {
                this.reset();
                closeModal();
            }
        });

        // Save button
        modal.querySelector('.settings-save-btn').addEventListener('click', () => {
            this.saveModalSettings(modal);
            closeModal();
        });

        // AI Provider selection change
        modal.querySelector('#ai-provider-select').addEventListener('change', (e) => {
            this.updateProviderVisibility(e.target.value);
        });

        // ESC key to close
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    }

    updateProviderVisibility(provider) {
        const providers = ['openai', 'gemini', 'openrouter'];
        providers.forEach(p => {
            const element = document.getElementById(`${p}-settings`);
            if (element) {
                if (p === provider) {
                    element.classList.remove('hidden');
                } else {
                    element.classList.add('hidden');
                }
            }
        });
    }

    saveModalSettings(modal) {
        // Collect all settings from the modal
        this.settings.theme = modal.querySelector('#theme-select').value;
        this.settings.fontSize = parseInt(modal.querySelector('#font-size-slider').value);
        this.settings.compactMode = modal.querySelector('#compact-mode-toggle').checked;
        this.settings.autoOpenTranscript = modal.querySelector('#auto-open-transcript-toggle').checked;
        this.settings.chatHeight = parseInt(modal.querySelector('#chat-height-slider').value);
        this.settings.typingSpeed = parseInt(modal.querySelector('#typing-speed-slider').value);
        this.settings.maxChatHistory = parseInt(modal.querySelector('#max-history-slider').value);
        this.settings.enableTimestampLinks = modal.querySelector('#timestamp-links-toggle').checked;
        this.settings.showLoadingAnimations = modal.querySelector('#loading-animations-toggle').checked;
        this.settings.autoScrollToBottom = modal.querySelector('#auto-scroll-toggle').checked;
        this.settings.enableKeyboardShortcuts = modal.querySelector('#keyboard-shortcuts-toggle').checked;
        this.settings.soundNotifications = modal.querySelector('#sound-notifications-toggle').checked;
        
        // AI Provider settings
        this.settings.aiProvider = modal.querySelector('#ai-provider-select').value;
        this.settings.openaiApiKey = modal.querySelector('#openai-api-key').value;
        this.settings.openaiModel = modal.querySelector('#openai-model').value;
        this.settings.geminiApiKey = modal.querySelector('#gemini-api-key').value;
        this.settings.geminiModel = modal.querySelector('#gemini-model').value;
        this.settings.openrouterApiKey = modal.querySelector('#openrouter-api-key').value;
        this.settings.openrouterModel = modal.querySelector('#openrouter-model').value;

        this.saveSettings();
    }

    // Show settings modal
    showSettings() {
        this.createSettingsModal();
    }
}

// Export for use in content.js
window.SettingsManager = SettingsManager;