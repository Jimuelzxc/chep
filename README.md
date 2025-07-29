<div align="center">
  <img src="./assets/logo-main.png" alt="There You Go Logo" width="150"/>
  <h1>chep</h1>
  <p>
is an AI-powered Firefox extension that enhances your YouTube experience. It allows you to chat with an AI, ask questions about the video, summarize video content, and more, directly on the YouTube watch page.
  </p>
</div>


## Features

### Enhanced Timestamp Handling
- **Smart timestamp validation** - Only creates clickable links for valid timestamps
- **Improved timestamp formatting** - Supports both [0:45] and 0:45 formats
- **Visual feedback** - Timestamps have enhanced styling with hover effects
- **Context awareness** - AI provides better context around timestamp references
- **Jump confirmation** - Optional feedback when jumping to timestamps
- **Chronological organization** - AI responses can be organized by timeline

### AI Integration
- Support for multiple AI providers (OpenAI, Google Gemini, OpenRouter)
- Customizable AI behavior and prompts
- Conversation history management
- Streaming responses with typing indicators

### User Experience
- Collapsible interface with smooth animations
- Keyboard shortcuts for quick access
- Auto-scroll with manual override detection
- Suggested prompts for common questions
- Settings panel with extensive customization options

## Installation

1.  Clone this repository or download the source code.
2.  Open Firefox and navigate to `about:debugging`.
3.  Click on "This Firefox" in the sidebar.
4.  Click on "Load Temporary Add-on..." and select the `manifest.json` file from the directory where you cloned or downloaded the extension.
