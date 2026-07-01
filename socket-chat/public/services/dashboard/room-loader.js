// room-loader.js

import { apiFetch } from "../utils/api-fetcher.js";
import { appendRoomToRoomsContainer } from "./room-view.js";

// Retrieve info about all rooms the user has joined from server
async function fetchRoomsInfo() {
    const response = await apiFetch("/rooms");
    const data = await response.json();
    return data.roomsInfo;
}

// Render rooms info to Dashboard page UI
function renderRooms(roomsInfo) {
    const container = document.getElementById("rooms-container");

    // For each room, append the corresponding info to the room container
    roomsInfo.forEach(roomInfo => {
        appendRoomToRoomsContainer(
            container,
            roomInfo,
            roomInfo.role === "creator" // isCreator
        );
    });
}

// Fetch rooms information from server, and render them to Dashboard page UI
async function loadRooms() {
    // Retrieve info about all rooms the user has joined from server
    const roomsInfo = await fetchRoomsInfo();
    // Render rooms info to Dashboard page UI
    renderRooms(roomsInfo);
}

export { loadRooms };