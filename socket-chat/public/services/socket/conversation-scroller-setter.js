// conversation-scroller-setter.js

import { prependMessages } from "../dashboard/conversation-services.js";

// Set up scroller in the conversation element to fetch and display more older messages upon user scrolling to the very top
async function setupConversationScroller() {
    const conversationElement = document.getElementById("conversation");
    conversationElement.addEventListener("scroll", async () => {
        // Prepend more messages to conversation upon user scrolling to the very top of the conversation element
        if (conversationElement.scrollTop === 0) {
            await prependMessages();
        }
    });
}

export { setupConversationScroller };