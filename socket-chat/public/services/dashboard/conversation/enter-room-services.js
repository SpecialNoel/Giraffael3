// enter-room-services.js

import { getRoomCodeFromParams, getCurrentRoomState, appendMessage } from "./services.js";

function prependMessagesToConversation(conversationElement, messages) {
    // Prepend fetched messages to conversation element
    messages.reverse().forEach(m => {
        const item = document.createElement("li");
        item.textContent = `[${m.username}]: ${m.content}`;
        item.classList.add("message");
        conversationElement.prepend(item);
        console.log(m.content, m.createdAt);
    });
}

async function loadOlderMessages(conversationElement) {
    // Get the corresponding existing room state, if any
    const roomCode = getRoomCodeFromParams();
    const state = getCurrentRoomState(roomCode);
    if (!state) {
        console.log("Failed to fetch older messages due to state being null");
        return false;
    }
    if (!state.hasMore) {
        console.log("No older messages to load");
        return false;
    }

    // Fetch older messages // TODO: Replace fetchOlderMessagesHelper() used below with other function, as it is currently used solely for scroller
    const messages = await fetchOlderMessagesHelper(roomCode, state);
    if (messages.length === 0) return false;

    prependMessagesToConversation(conversationElement, messages);
    console.log("Loaded older messages to fill conversation element");
    return true;
}

// Render the received messages on the conversation element in the room on Dashboard page UI
async function renderConversation(conversationElement, messages) {
    // Empty the current conversation first
    conversationElement.innerHTML = "";

    // For each received message, add info about the message to the conversation
    messages.forEach(({ messageObjectId, userId, username, content, type }) => {
        appendMessage(conversationElement, content, username);
    });

    // Send requests to fetch older messages from server, and prepend them to conversation element, 
    // until conversation element is filled
    while (conversationElement.scrollHeight <= conversationElement.clientHeight) {
        const loaded = await loadOlderMessages(conversationElement);
        if (!loaded) break;
    }
}

export { renderConversation };