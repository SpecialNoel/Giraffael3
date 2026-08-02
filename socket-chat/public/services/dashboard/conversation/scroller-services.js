// scroller-services.js

import { parseResponse } from "../../utils/response-parser.js";
import { fetchOlderMessages } from "../room-api.js";
import { updateRoomState } from "../../states/dashboard-state.js";
import { getRoomCodeFromParams,
         getCurrentRoomState,
         prependMessage } from "./services.js";

// Fetch some older messages of the conversation
async function getOlderMessages(conversationElement) {
    async function fetchOlderMessagesHelper(conversationElement, roomCode, state) {
        // Fetch older messages
        const data = await parseResponse(await fetchOlderMessages(roomCode, state.cursor));
        // Update the mapping
        updateRoomState(roomCode, {
            messages: [...state.messages, ...data.messages],
            cursor: data.nextCursor,
            hasMore: data.hasMore,
        });
        return data.messages;
    }

    // Get the corresponding existing room state, if any
    const roomCode = getRoomCodeFromParams();
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
    const messages = await fetchOlderMessagesHelper(conversationElement, roomCode, state);
    return messages;
}

// Prepend some older messages of the conversation on top of existing messages
function renderOlderMessages(conversationElement, messages) {
    if (!messages) return;

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

export { getOlderMessages, renderOlderMessages };