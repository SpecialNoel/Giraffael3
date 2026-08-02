// services.js

// This files contains functions shared by both message-fetching functions, namely:
// "Initial message fetching / Cached message restoring upon user entering the room", and 
// "Older message fetching upon user scrolling to the top"

import { dashboardState } from "../../states/dashboard-state.js";

function getRoomCodeFromParams() {
    return new URLSearchParams(window.location.search).get("room");
}

function getCurrentRoomState(roomCode) {
    // Get the corresponding existing room state, if any
    return dashboardState.roomStates.get(roomCode) ?? null;
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

export { getRoomCodeFromParams, 
         getCurrentRoomState,
         prependMessage,
         appendMessage };