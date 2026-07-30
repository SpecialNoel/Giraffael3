// conversation-services-helpers.js

import { fetchMoreMessages } from "./room-api.js";
import { parseResponse } from "../utils/response-parser.js";
import { dashboardState } from "../states/dashboard-state.js";

function retrieveRoomCodeAndPaginationState() {
    // Get the existing mapping of room code to { cursor, hasMore }, if any
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get("room");
    const state = dashboardState.roomPaginationStates.get(roomCode) ?? null;
    const hasMore = state ? state.hasMore : false;
    return { roomCode, state, hasMore };
}

async function fetchMoreMessagesAndUpdatePaginationState(roomCode, state) {
    // Fetch more messages
    const cursor = state ? state.cursor : null;
    const data = await parseResponse(await fetchMoreMessages(roomCode, cursor));
    const messages = data.messages;
    const nextCursor = data.nextCursor;
    const newState = {
        cursor: nextCursor,
        hasMore: data.hasMore
    }
    // Update the mapping
    dashboardState.roomPaginationStates.set(roomCode, newState);
    return messages;
}

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

async function loadMoreMessages(conversationElement) {
    // Check the existing mapping of room code to { cursor, hasMore }, if any
    const { roomCode, state, hasMore } = retrieveRoomCodeAndPaginationState();
    if (!hasMore) {
        console.log("No more messages to load");
        return false;
    }

    // Fetch more messages
    const messages = await fetchMoreMessagesAndUpdatePaginationState(roomCode, state);
    if (messages.length === 0) return false;

    prependMessagesToConversation(conversationElement, messages);
    console.log("Loaded more messages to fill conversation element");
    return true;
}

export { retrieveRoomCodeAndPaginationState, 
         fetchMoreMessagesAndUpdatePaginationState, 
         prependMessagesToConversation,
         loadMoreMessages }