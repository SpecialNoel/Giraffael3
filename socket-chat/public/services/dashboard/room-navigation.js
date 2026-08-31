// room-navigation.js

import { getRoomCodeFromParams } from "../dashboard/conversation/services.js";
import { getCurrentRoomState } from "../states/dashboard-state.js";
import { updateRoomCodeInURL } from "./room-view.js";

// Fire an "enter room" socket event to server
function enterRoom(socket, roomCode) {
    if (!roomCode) throw Error("User trying to enter a room with empty room code");

    // Check for the cursor on existing state
    const state = getCurrentRoomState(roomCode);
    const cursor = state ? state.cursor : null;

    // Send an "enter room" request to server via socket events
    socket.emit("enterRoom", roomCode, cursor);
}

// Set up the application so that it navigates to the respective page
// when the user uses the browser's Back and Forward buttons
function initializeHistoryNavigation(socket) {
    // Fire the "enter room" socket event (used in room-navigation.js)
    function enterRoomFromURL(socket) {
        // Fetch the room code encoded in user's browser url bar
        const roomCode = getRoomCodeFromParams();

        // Initialize the conversation cursor for this room, if this user has never retrieved message yet
        // Otherwise, fetch the stored cursor
        const state = getCurrentRoomState(roomCode);
        const cursor = state ? state.cursor : null;

        // Fire the "enter room" event to server
        socket.emit("enterRoom", roomCode, cursor);
    }

    // popstate is fired whenever the active history entry changes (Back/Forward button clicked)
    window.addEventListener("popstate", () => {
        // Atomically fetch the room code from url bar, and fire the "enter room" socket event
        enterRoomFromURL(socket);
    });
}

export { enterRoom, initializeHistoryNavigation };