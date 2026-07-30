// conversation-services.js

import { retrieveRoomCodeAndPaginationState, 
         fetchMoreMessagesAndUpdatePaginationState, 
         prependMessagesToConversation,
         loadMoreMessages } from "./conversation-services-helpers.js";

// Append the message received from other users in the room to the existing conversation
function appendMessage(conversationElement, content, senderUsername) {
    // Append the message to the conversation
    const item = document.createElement("li");
    item.textContent = `[${senderUsername}]: ${content}`;
    item.classList.add("message");
    conversationElement.appendChild(item);
    // Scroll the browser window to the bottom of the conversation element
    conversationElement.scrollTop = conversationElement.scrollHeight;
}

// Prepend the message exchanged over the room to the existing conversation
function prependMessage(conversationElement, content, senderUsername) {
    const item = document.createElement("li");
    item.textContent = `[${senderUsername}]: ${content}`;
    item.classList.add("message");
    conversationElement.prepend(item);
}

// Render the received messages on the conversation element in the room on Dashboard page UI
async function renderConversation(conversationElement, messages) {
    // Empty the current conversation first
    conversationElement.innerHTML = "";

    // For each received message, add info about the message to the conversation
    messages.forEach(({ messageObjectId, userId, username, content, type }) => {
        appendMessage(conversationElement, content, username);
    });

    // Send requests to fetch more messages from server, and prepend them to conversation element, 
    // until conversation element is filled
    while (conversationElement.scrollHeight <= conversationElement.clientHeight) {
        const loaded = await loadMoreMessages(conversationElement);
        if (!loaded) break;
    }
}

// Prepend some older messages of the conversation on top of existing messages
async function fetchAndRenderMoreMessages(conversationElement) {
    // Check the existing mapping of room code to { cursor, hasMore }, if any
    const { roomCode, state, hasMore } = retrieveRoomCodeAndPaginationState();
    if (!hasMore) {
        console.log("No more messages to load");
        return;
    }

    // Fetch more messages
    const messages = await fetchMoreMessagesAndUpdatePaginationState(roomCode, state);

    // Prepend the fetch messages to the conversation element
    const prevHeight = conversationElement.scrollHeight;
    console.log("Prepending:");
    // Reverse the messages again due to the property of HTML element prepending
    messages.reverse().forEach(m => {
        prependMessage(conversationElement, m.content, m.username);
        console.log(m.content, m.createdAt);
    });
    const newHeight = conversationElement.scrollHeight;
    // Update the current location of the conversation element to provide smoother, more natural user scroll action
    // Without this step, prepending messages will immediately locate the user to the top of the conversation element
    // i.e. the user sees the older messages (located at top) first than the newer messages (located at bottom)
    conversationElement.scrollTop = newHeight - prevHeight;
}

export { appendMessage,
         renderConversation, 
         fetchAndRenderMoreMessages };