// conversation-scroller-setter.js

import { fetchAndRenderMoreMessages } from "./conversation-services.js";

// Set up scroller in the conversation element to fetch and display more older messages upon user scrolling to the very top
async function setupConversationScroller() {
    // isLoading is used to guard from the case where the user fires multiple requests just to prepend/fulfill the a single request 
    // (i.e. scroll to top multiple times before the actual loading action is completed)
    const conversationElement = document.getElementById("conversation");
    let isLoading = false;
    conversationElement.addEventListener("scroll", async () => {
        // Prepend more messages to conversation upon user scrolling to the very top of the conversation element
        if (conversationElement.scrollTop === 0 && !isLoading) {
            isLoading = true;
            await fetchAndRenderMoreMessages(conversationElement);
            isLoading = false;
        }
    });
}

export { setupConversationScroller };