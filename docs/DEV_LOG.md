## ✅ Rules:

0. **Whenever I share or mention this DEV_LOG.md issues, bugs, feature requests, or general notes, automatically add them here.**
1. **Rewrite users unclear thoughts into clear, concise wording.**
2. **Organize into these sections:**
   - **Bugs**
   - **Feature Requests**
   - **General Notes**
3. **Status indicators:**
   - ❌ = Pending  
   - ✅ = Completed  
4. **Do NOT fix anything yet.**  
   Only log information for future reference.

---




# DEV_LOG - Development Log


This file tracks bugs, feature requests, and general notes for future reference and will be addressed systematically when the time comes.



## Bugs
*Issues that need to be fixed*


- ✅  **Settings Icons are Not Visually Appealing:** The current icons used for settings are not well-designed and should be replaced with improved versions.
- ✅ **AI Hallucinates Timestamps on Follow-up Questions:** When asking a follow-up question about a specific idea from the initial summary, the AI generates timestamps that do not exist in the video transcript. This occurs even when the initial summary is accurate.
- ✅ **State Not Resetting on New Video:** The application state, including the chat history and transcript data, does not reset when navigating to a new YouTube video on the same tab. The data from the previous video persists. (Fix implemented by adding a URL change listener. Ready for verification.)
- ✅ **Transcript Toggle Requires Chat Interaction:** The transcript does not automatically appear when clicking the toggle button. Currently, users must enter a chat message first before the transcript becomes visible. The transcript should display immediately when the toggle is activated.
- ❌ **UI Issues in Light Mode:** The user interface has visual problems when the system is switched to light mode, resulting in a poor user experience.

## Feature Requests
*New functionality to be implemented*

- ✅ **Add Reset Button for Chat History:** Implement a button to clear the current chat history and start a new conversation, similar to creating a new chat session.
- ✅ **Enable Multi-Turn Conversations:** The chat does not maintain conversational history. Follow-up questions are treated as new, independent queries, so the AI cannot refer to previous turns in the conversation.
- ✅ **Expandable/Full Screen Chat Interface:** Add functionality to expand the chat interface or make it full screen for better readability and user experience, as the current chat display area is too small. (Implemented with expand button in header that toggles between normal and full-screen modes)
- ✅ **Add Loading Animation for Data Fetching:** Implement visual loading indicators when the AI is processing requests and fetching transcript data to improve user experience and provide feedback during wait times. (Implemented with spinning loader for transcript loading and typing dots for AI responses)
- ✅ **Improve Initial Transcript Message:** Change the generic "Transcript loaded! Ask me anything about this video." message to something more engaging and informative. (Updated to "🎬 Ready to discuss this video! What would you like to know?" with emojis and better messaging throughout)
- ✅ **Add OpenRouter as AI Provider:** Investigate and integrate OpenRouter to expand the available AI model options.

## General Notes
*Development thoughts, observations, and miscellaneous notes*

- ✅ **Removed Fullscreen Mode:** The expandable/fullscreen chat interface has been removed to simplify the user experience.
- ✅ **Simplify API Providers:** Refactor the codebase to remove support for other API providers, concentrating exclusively on Gemini and OpenAI to streamline development and reduce complexity.
