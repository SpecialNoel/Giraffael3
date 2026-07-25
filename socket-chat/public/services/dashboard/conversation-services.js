// conversation-services.js

import { fetchMoreMessages } from "./room-api.js";
import { parseResponse } from "../utils/response-parser.js";

// Render the received messages on the conversation element in the room on Dashboard page UI
function renderConversation(conversationElement, messages) {
    // Empty the current conversation first
    conversationElement.innerHTML = "";

    // For each received message, add info about the message to the conversation
    messages.forEach(({ messageObjectId, userId, username, content, type }) => {
        const item = document.createElement("li");
        item.textContent = `[${username}]: ${content}`;
        conversationElement.appendChild(item);
        // Scroll the browser window to the bottom of the conversation element
        conversationElement.scrollTop = conversationElement.scrollHeight;
    });
}

// Append the message received from other users in the room to the existing conversation
function appendMessage(conversationElement, content, senderUsername) {
    // Append the message to the conversation
    const item = document.createElement("li");
    item.textContent = `[${senderUsername}]: ${content}`;
    conversationElement.appendChild(item);
    // Scroll the browser window to the bottom of the conversation element
    conversationElement.scrollTop = conversationElement.scrollHeight;
}

// Prepend some older messages of the conversation on top of existing messages
async function prependMessages(conversationElement, roomPaginationStates) {
    // Check the existing mapping of room code to { cursor, hasMore }, if any
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get("room");
    const state = roomPaginationStates.get(roomCode) ?? null;
    const hasMore = state ? state.hasMore : false;
    if (!hasMore) {
        console.log("No more messages to load");
        return;
    }

    // Fetching more messages
    const cursor = state ? state.cursor : null;
    const data = await parseResponse(await fetchMoreMessages(roomCode, cursor));
    const messages = data.messages;
    const nextCursor = data.nextCursor;
    const newState = {
        cursor: nextCursor,
        hasMore: data.hasMore
    }
    // Update the mapping
    roomPaginationStates.set(roomCode, newState);

    // Prepend the fetch messages to the conversation element
    const prevHeight = conversationElement.scrollHeight;
    console.log("Prepending:");
    // Reverse the messages again due to the property of HTML element prepending
    messages.reverse().forEach(m => {
        const item = document.createElement("li");
        item.textContent = `[${m.username}]: ${m.content}`;
        conversationElement.prepend(item);
        console.log(m.content, m.createdAt);
    });
    const newHeight = conversationElement.scrollHeight;
    // Update the current location of the conversation element to provide smoother, more natural user scroll action
    // Without this step, prepending messages will immediately locate the user to the top of the conversation element
    // i.e. the user sees the older messages (located at top) first than the newer messages (located at bottom)
    conversationElement.scrollTop = newHeight - prevHeight;
}

export { renderConversation, 
         appendMessage,
         prependMessages };