// conversation-scroller-setter.js

import { prependMessages } from "./conversation-services.js";

// Set up scroller in the conversation element to fetch and display more older messages upon user scrolling to the very top
async function setupConversationScroller(conversationElement, roomPaginationStates) {
    // isLoading is used to guard from the case where the user fires multiple requests just to prepend/fulfill the a single request 
    // (i.e. scroll to top multiple times before the actual loading action is completed)
    let isLoading = false;
    conversationElement.addEventListener("scroll", async () => {
        // Prepend more messages to conversation upon user scrolling to the very top of the conversation element
        if (conversationElement.scrollTop === 0 && !isLoading) {
            isLoading = true;
            await prependMessages(conversationElement, roomPaginationStates);
            isLoading = false;
        }
    });
}

export { setupConversationScroller };