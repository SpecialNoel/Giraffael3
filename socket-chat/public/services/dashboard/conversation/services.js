// services.js

// This files contains functions shared by both message-fetching functions, namely:
// "Initial message fetching / Cached message restoring upon user entering the room", and 
// "Older message fetching upon user scrolling to the top"

import { getCurrentRoomState, updateRoomState } from "../../states/dashboard-state.js";
import { parseResponse } from "../../utils/response-parser.js";
import { fetchOlderMessages } from "../room-api.js";

function getRoomCodeFromParams() {
    return new URLSearchParams(window.location.search).get("room");
}

// Prepend the message exchanged over the room to the existing conversation
function prependMessage(conversationElement, content, senderUsername) {
    const item = document.createElement("li");
    item.textContent = `[${senderUsername}]: ${content}`;
    item.classList.add("message");
    conversationElement.prepend(item);
}

// Append the message received from other users in the room to the existing conversation
function appendMessage(conversationElement, content, senderUsername) {
    // Append the message to the conversation
    const item = document.createElement("li");
    item.textContent = `[${senderUsername}]: ${content}`;
    item.classList.add("message");
    conversationElement.appendChild(item);
    // Scroll the browser window to the bottom of the conversation element
    // conversationElement.scrollTop = conversationElement.scrollHeight;
}

// Fetch some older messages of the conversation
async function getOlderMessages() {
    async function fetchOlderMessagesHelper(roomCode, state) {
        // Fetch older messages
        const result = await parseResponse(await fetchOlderMessages(roomCode, state.cursor));
        // Update the mapping
        updateRoomState(roomCode, {
            messages: [...result.data.messages, ...state.messages], // here we prepend new messages to existing messages
            cursor: result.data.nextCursor,
            hasMore: result.data.hasMore,
        });
        return result.data.messages;
    }

    // Get the corresponding existing room state, if any
    const roomCode = getRoomCodeFromParams();
    if (!roomCode) throw Error("User trying to get older messages with empty room code");

    const state = getCurrentRoomState(roomCode);
    if (!state) {
        console.log("Failed to fetch older messages due to state being null");
        return null;
    }
    if (!state.hasMore) {
        console.log("No older messages to load");
        return null;
    }

    // Fetch older messages
    const messages = await fetchOlderMessagesHelper(roomCode, state);
    return messages;
}

// Prepend some older messages of the conversation on top of existing messages
function renderOlderMessages(conversationElement, messages) {
    if (!messages) return;

    // Prepend the fetch messages to the conversation element
    const prevHeight = conversationElement.scrollHeight;
    // Reverse the messages again due to the property of HTML element prepending
    messages.toReversed().forEach(m => {
        prependMessage(conversationElement, m.content, m.username);
    });
    const newHeight = conversationElement.scrollHeight;
    // Update the current location of the conversation element to provide smoother, more natural user scroll action
    // Without this step, prepending messages will immediately locate the user to the top of the conversation element
    // i.e. the user sees the older messages (located at top) first than the newer messages (located at bottom)
    conversationElement.scrollTop = newHeight - prevHeight;
} 

export { 
    getRoomCodeFromParams, 
    prependMessage,
    appendMessage,
    getOlderMessages,
    renderOlderMessages 
};