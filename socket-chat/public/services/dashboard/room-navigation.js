// room-navigation.js

import { enterRoom, enterRoomFromURL } from "../socket/room-services.js";

// Atomically modify the url on user's browser, and fire an "enter room" socket event to server
function openRoom(socket, roomCode) {
    // Modify the url to reflect user entering this room without refreshing the page
    history.pushState({}, "", `/dashboard?room=${roomCode}`);
    // Send an "enter room" request to server via socket events
    enterRoom(socket, roomCode);
}

// Set up the application so that it navigates when the user uses the browser's Back and Forward buttons
function initializeHistoryNavigation(socket) {
    // popstate is fired whenever the active history entry changes (Back/Forward button clicked)
    window.addEventListener("popstate", () => {
        // Atomically fetch the room code from url bar, and fire the "enter room" socket event
        enterRoomFromURL(socket);
    });
}

export { openRoom, initializeHistoryNavigation };