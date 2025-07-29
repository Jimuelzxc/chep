# DEV_LOG - Development Log
This file tracks bugs, feature requests, and general notes for future reference and will be addressed systematically when the time comes.



**AI PROMPT:**  
0. **Whenever I share or mention this DEV_LOG.md issues, bugs, feature requests, or general notes, automatically add them here.**
1. **Rewrite users unclear thoughts into clear, concise wording.**
2. **Organize into these sections:**
   - **Bugs**
   - **Feature Requests**
   - **General Notes**
3. **Do NOT fix anything yet.**  
   Only log information for future reference.



**Status indicators:**
- ❌ = Pending  
- ✅ = Completed  

## Bugs
*Issues that need to be fixed*


- ✅  **Settings Icons are Not Visually Appealing:** The current icons used for settings are not well-designed and should be replaced with improved versions.
- ✅ **AI Hallucinates Timestamps on Follow-up Questions:** When asking a follow-up question about a specific idea from the initial summary, the AI generates timestamps that do not exist in the video transcript. This occurs even when the initial summary is accurate.
- ✅ **State Not Resetting on New Video:** The application state, including the chat history and transcript data, does not reset when navigating to a new YouTube video on the same tab. The data from the previous video persists. (Fix implemented by adding a URL change listener. Ready for verification.)
- ✅ **Transcript Toggle Requires Chat Interaction:** The transcript does not automatically appear when clicking the toggle button. Currently, users must enter a chat message first before the transcript becomes visible. The transcript should display immediately when the toggle is activated.
- ❌ **UI Issues in Light Mode:** The user interface has visual problems when the system is switched to light mode, resulting in a poor user experience.
- ✅ **Scrolling Disabled During Streaming:** Users cannot scroll up in the chat interface while the AI's response is being streamed. Scrolling should be possible even when the response is not yet complete. (Fixed by implementing scroll detection that disables auto-scroll when user manually scrolls up and re-enables it when they return to bottom)
- ✅ **System Prompt Too Restrictive:** The AI refuses to answer general knowledge questions about topics mentioned in the video because the system prompt forces it to only use transcript information. For example, if a video is about "String Theory" and user asks "What is string theory?", the AI says it's not in the transcript instead of providing helpful general knowledge while also referencing what the video specifically covers.



## Feature Requests
*New functionality to be implemented*

- ✅ **Add Reset Button for Chat History:** Implement a button to clear the current chat history and start a new conversation, similar to creating a new chat session.
- ✅ **Enable Multi-Turn Conversations:** The chat does not maintain conversational history. Follow-up questions are treated as new, independent queries, so the AI cannot refer to previous turns in the conversation.
- ✅ **Expandable/Full Screen Chat Interface:** Add functionality to expand the chat interface or make it full screen for better readability and user experience, as the current chat display area is too small. (Implemented with expand button in header that toggles between normal and full-screen modes)
- ✅ **Add Loading Animation for Data Fetching:** Implement visual loading indicators when the AI is processing requests and fetching transcript data to improve user experience and provide feedback during wait times. (Implemented with spinning loader for transcript loading and typing dots for AI responses)
- ✅ **Improve Initial Transcript Message:** Change the generic "Transcript loaded! Ask me anything about this video." message to something more engaging and informative. (Updated to "🎬 Ready to discuss this video! What would you like to know?" with emojis and better messaging throughout)
- ✅ **Add OpenRouter as AI Provider:** Investigate and integrate OpenRouter to expand the available AI model options.
- ✅ **Reorganize Settings Panel Layout:** Improve the settings user experience by moving the AI Configuration section to the top of the settings panel, above Appearance and Features sections, since API configuration is the most critical setting for users.

- ✅ **Implement Suggested Prompts/Quick Action Buttons:**
    - Display dynamic suggestions: Show contextually relevant prompt suggestions (e.g., "Summarize this video," "Key takeaways," "What is the main topic?") above the chat input field.
    - Allow user customization: Enable users to define their own custom quick action buttons or frequently used prompts in the settings.
    - Integrate with chat history: Suggestions could also be based on previous turns in the conversation or common follow-up questions.
    - Hide suggestions after selection: Automatically hide the suggested prompt buttons once a user clicks on one to streamline the interface.

## General Notes
*Development thoughts, observations, and miscellaneous notes*

- ✅ **Removed Fullscreen Mode:** The expandable/fullscreen chat interface has been removed to simplify the user experience.
- ✅ **Simplify API Providers:** Refactor the codebase to remove support for other API providers, concentrating exclusively on Gemini and OpenAI to streamline development and reduce complexity.
