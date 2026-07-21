// room-loader.js

import { apiFetch } from "../utils/api-fetcher.js";
import { parseResponse } from "../utils/response-parser.js";
import { appendRoomToRoomsContainer } from "./room-view.js";

// Fetch rooms information from server, and render them to Dashboard page UI
async function loadRooms() {
    // Retrieve info about all rooms the user has joined from server
    const data = await parseResponse(await apiFetch("/rooms"));
    const roomsInfo = data.roomsInfo;

    // Render rooms info to Dashboard page UI
    const container = document.getElementById("rooms-container");
    // For each room, append the corresponding info to the room container
    roomsInfo.forEach(roomInfo => {
        appendRoomToRoomsContainer(
            container,
            roomInfo,
            roomInfo.role
        );
    });
}

export { loadRooms };