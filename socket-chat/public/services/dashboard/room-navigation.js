// room-navigation.js

import { enterRoom, enterRoomFromURL } from "../socket/room-services.js";

function navigateToRoom(socket, roomCode) {
    history.pushState({}, "", `/dashboard?room=${roomCode}`);
    enterRoom(socket, roomCode);
}

function setupNavigation(socket) {
    window.addEventListener("popstate", () => {
        enterRoomFromURL(socket);
    });
}

export { navigateToRoom, setupNavigation };