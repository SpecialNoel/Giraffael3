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

// Prepend some older messages of the whole conversation on top of existing messages
async function prependMessages(conversationElement, conversationCursors) {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get("room");
    const conversationCursor = conversationCursors.get(roomCode) ?? null; // TODO: update conversationCursors to contain hasMore
    if (!conversationCursor) {
        console.log("No more messages to load");
        return;
    }

    const data = await parseResponse(await fetchMoreMessages(roomCode, conversationCursor));
    const messages = data.messages;
    const nextCursor = data.nextCursor;
    const hasMore = data.hasMore;
    console.log(`conversationCursor: ${conversationCursor}`);
    console.log(`nextCursor: ${nextCursor}`);
    conversationCursors.set(roomCode, nextCursor);
    console.log("Prepending:");
    messages.forEach(m => console.log(m.content, m.createdAt));
}

export { renderConversation, 
         appendMessage,
         prependMessages };