// enter-room-services.js

import { appendMessage, getOlderMessages, renderOlderMessages } from "./services.js";
import { getCurrentRoomState, updateRoomState } from "../../states/dashboard-state.js";

function getCachedMessages(roomCode) {
    if (!roomCode) throw Error("User trying to get cached messages with empty room code");

    const state = getCurrentRoomState(roomCode);
    if (!state) {
        console.log("Failed to fetch older messages due to state being null");
        return null;
    }
    return state.messages;
}

function getCachedMembers(roomCode) {
   if (!roomCode) throw Error("User trying to get cached messages with empty room code");

    const state = getCurrentRoomState(roomCode);
    if (!state) {
        console.log("Failed to fetch older messages due to state being null");
        return null;
    }
    return state.members;
}

function storeMessageToState(roomCode, message) {
    if (!roomCode) throw Error("User trying to get store messages with empty room code");

    // Update the messages field of the room in the dashboard state
    const state = getCurrentRoomState(roomCode);
    if (!state) {
        console.log("Failed to receive chat message due to state being null");
        return;
    }        
    updateRoomState(roomCode, {
        messages: [...state.messages, message]
    });
}

// Render the received messages on the conversation element in the room on Dashboard page UI
async function renderConversation(conversationElement, messages) {
    // Empty the current conversation first
    conversationElement.innerHTML = "";

    renderOlderMessages(conversationElement, messages);

    // Send requests to fetch older messages from server, and prepend them to conversation element, 
    // until conversation element is filled
    while (conversationElement.scrollHeight <= conversationElement.clientHeight) {
        const messages = await getOlderMessages(conversationElement);
        if (!messages) break;
        renderOlderMessages(conversationElement, messages);
    }
    // Scroll the conversation to the very bottom
    conversationElement.scrollTop = conversationElement.scrollHeight;
    console.log("Loaded older messages to fill conversation element");
}

export { getCachedMessages, 
         getCachedMembers,
         storeMessageToState, 
         renderConversation };