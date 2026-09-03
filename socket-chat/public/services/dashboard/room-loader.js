// room-loader.js

import { parseResponse } from "../utils/response-parser.js";
import { getRoomsInfo } from "./room-api.js";
import { appendRoomToRoomsContainer } from "./room-view.js";

// Fetch rooms information from server, and render them to Dashboard page UI
async function loadRooms() {
    // Retrieve info about all rooms the user has joined from server
    const result = await parseResponse(await getRoomsInfo());
    const roomsInfo = result.data.roomsInfo;

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