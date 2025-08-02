<div align="center">
  <img src="./assets/logo-main.png" alt="chep Logo" width="150"/>
  <h1>chep</h1>
  <p>
    AI-powered Firefox extension for YouTube. Chat with AI about any video, get summaries, and learn more while watching.
  </p>

  <p>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/chep/">
      <img src="https://img.shields.io/badge/Firefox-Add--on-FF7139?style=for-the-badge&logo=firefox&logoColor=white" alt="Firefox Add-on">
    </a>
  </p>
</div>

<div align="center">
  <img src="./assets/chep-demo.gif" alt="chep demo" width="100%" style="max-width: 600px; margin: 20px 0;"/>
</div>

## Features

- **Multiple AI providers**: OpenAI, Google Gemini, OpenRouter
- **Video summaries**: Get key points from long videos
- **Timestamp responses**: AI answers include time links
- **Custom settings**: Change how AI talks and acts
- **Private**: Your chats stay between you and the AI service

## Installation

**Easy way:**
1. Go to [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/chep/)
2. Click "Add to Firefox"
3. Set up your AI provider
4. Start chatting on YouTube!

**From source:**
1. Clone this repo: `git clone https://github.com/Jimuelzxc/chep.git`
2. Open Firefox → `about:debugging`
3. Click "This Firefox" → "Load Temporary Add-on"
4. Select `manifest.json`

## Setup

You need an API key from one of these:

- **Google Gemini** (recommended - easy to access): Get key at [aistudio.google.com](https://aistudio.google.com/app/apikey)
- **OpenAI**: Get key at [platform.openai.com](https://platform.openai.com/api-keys)
- **OpenRouter**: Get key at [openrouter.ai](https://openrouter.ai/)

Then open chep settings on any YouTube page and enter your key.

## Usage

- "What is this video about?"
- "Summarize this video"
- "What did they say about [topic]?"

AI will respond with timestamps so you can jump to the right parts.

## Contributing

1. Fork the repo
2. Make your changes
3. Test on YouTube videos
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file.
