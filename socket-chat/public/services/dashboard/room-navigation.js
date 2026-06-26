// room-navigation.js

import { enterRoom, enterRoomFromURL } from "../socket/room-services.js";

function navigateToRoom(socket, roomCode) {
    // Modify the url to reflect user entering this room without refreshing the page
    history.pushState({}, "", `/dashboard?room=${roomCode}`);

    // Send an "enter room" request to server via socket events
    enterRoom(socket, roomCode);
}

function setupNavigation(socket) {
    window.addEventListener("popstate", () => {
        enterRoomFromURL(socket);
    });
}

export { navigateToRoom, setupNavigation };