# CHEP | YouTube AI Assistant

## Description

A powerful browser extension that transforms your YouTube viewing experience by adding an intelligent AI assistant directly to video pages. Chat with videos using multiple AI providers (OpenAI, Gemini, Claude, Ollama) to get instant answers, explanations, and insights based on the video's transcript content.

## Key Features

- **🤖 Multiple AI Providers**: Choose from OpenAI, Google Gemini, Anthropic Claude, or local Ollama models
- **⚙️ Easy Configuration**: Simple settings panel to configure your preferred AI provider
- **⏰ Smart Timestamps**: Click on timestamps in AI responses to jump directly to relevant video moments
- **💬 Contextual Conversations**: Maintains conversation history for natural, flowing discussions
- **🔄 Real-time Streaming**: Responses stream in real-time for a smooth chat experience
- **📝 Transcript-based**: Uses actual video transcripts for accurate, relevant answers
- **🎯 Seamless Integration**: Blends naturally with YouTube's interface design
- **🚀 No Server Required**: Works directly with AI APIs - no backend server needed
- **⌨️ Keyboard Shortcuts**: Quick access with customizable keyboard shortcuts
- **🎨 Customizable UI**: Adjustable themes, font sizes, and chat behavior

## Installation

### Prerequisites
- Firefox browser
- API key from your preferred AI provider (see Supported AI Providers below)

### Steps

1. **Clone this repository**
   ```bash
   git clone <your-repo-url>
   cd youtube-ai-assistant
   ```

2. **Load the extension in Firefox**
   - Open Firefox and go to `about:debugging`
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on..."
   - Select the `manifest.json` file from this directory

3. **Configure your AI provider**
   - Navigate to any YouTube video
   - Click the AI Assistant settings gear icon (⚙️)
   - Choose your preferred AI provider and add your API key

## Supported AI Providers

### OpenAI
- **Models**: GPT-4o, GPT-4o-mini, GPT-4-turbo, GPT-3.5-turbo
- **Get API Key**: https://platform.openai.com/api-keys
- **Cost**: Pay-per-use pricing

### Google Gemini
- **Models**: Gemini 1.5 Flash, Gemini 1.5 Pro, Gemini Pro
- **Get API Key**: https://aistudio.google.com/app/apikey
- **Cost**: Generous free tier available

### Anthropic Claude
- **Models**: Claude 3 Haiku, Claude 3 Sonnet, Claude 3 Opus
- **Get API Key**: https://console.anthropic.com/
- **Cost**: Pay-per-use pricing

### Ollama (Local)
- **Models**: Llama 3.2, Mistral, CodeLlama, and many others
- **Setup**: Install from https://ollama.ai/
- **Cost**: Free (runs locally)

## Usage

### Basic Usage

1. **Navigate to any YouTube video** with available transcripts
2. **Find the AI Assistant panel** in the right sidebar
3. **Click to expand** and start chatting!
4. **Use the settings (⚙️)** to customize your experience

### Settings & Customization

Access settings by clicking the gear icon (⚙️) in the AI Assistant header:

- **AI Provider**: Choose your preferred AI service
- **API Configuration**: Add your API keys and select models
- **Appearance**: Adjust theme, font size, and compact mode
- **Chat Behavior**: Configure auto-scroll, typing speed, and history length
- **Features**: Enable/disable timestamp links, animations, and shortcuts

### Keyboard Shortcuts

- `Ctrl/Cmd + Shift + A`: Toggle AI panel
- `Ctrl/Cmd + Shift + S`: Open settings
- `Ctrl/Cmd + Shift + F`: Toggle fullscreen mode
- `/`: Focus chat input (when panel is open)

### Sample Conversations

- *"What are the main points discussed in this video?"*
- *"Can you explain the concept mentioned at 5:30?"*
- *"Summarize the conclusion of this tutorial"*
- *"What tools were recommended in this video?"*

## Project Structure

```
├── manifest.json        # Extension manifest file
├── content.js          # Main extension content script
├── settings.js         # Settings management system
├── ai-service.js       # AI provider integration
├── README.md           # This documentation
└── .gitignore         # Git ignore rules
```

## Features in Detail

### Smart Transcript Integration
- Automatically detects and opens video transcripts
- Extracts timestamp information for clickable links
- Works with YouTube's native transcript system

### Multi-Provider AI Support
- Seamless switching between different AI providers
- Provider-specific optimizations and error handling
- Secure API key storage in browser local storage

### Customizable Experience
- Dark/light theme support
- Adjustable chat window size and font size
- Configurable typing speed and response behavior
- Compact mode for minimal UI footprint

### Privacy & Security
- API keys stored locally in your browser
- No data sent to third-party servers (except chosen AI provider)
- Transcript data processed client-side

## Troubleshooting

### Common Issues

**"AI provider not configured" error**
- Go to Settings (⚙️) and add your API key for the selected provider

**"Could not access transcript" warning**
- Manually open transcript: Click "..." → "Show transcript" below the video
- Some videos may not have transcripts available

**API errors**
- Check your API key is valid and has sufficient credits
- Verify the selected model is available for your API key

**Extension not loading**
- Ensure Developer mode is enabled in Chrome extensions
- Try reloading the extension from chrome://extensions/

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Clone the repository
2. Make your changes
3. Test the extension by loading it unpacked in Chrome
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Ensure your API keys are properly configured

---

**Note**: This extension requires an active internet connection and valid API keys from your chosen AI provider. API usage may incur costs depending on your provider and usage patterns.