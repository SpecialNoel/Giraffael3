// conversation-scroller-setter.js

import { prependMessages } from "./conversation-services.js";

// Set up scroller in the conversation element to fetch and display more older messages upon user scrolling to the very top
async function setupConversationScroller(conversationElement, conversationCursors) {
    conversationElement.addEventListener("scroll", async () => {
        // Prepend more messages to conversation upon user scrolling to the very top of the conversation element
        if (conversationElement.scrollTop === 0) {
            await prependMessages(conversationElement, conversationCursors);
        }
    });
}

export { setupConversationScroller };