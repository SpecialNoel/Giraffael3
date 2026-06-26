// room-loader.js

import { apiFetch } from "../utils/api-fetcher.js";
import { appendRoomToRoomsContainer } from "../../utils/rooms-container-handler.js";

async function loadRooms() {
    // Retrieve info about all rooms the user has joined from server
    const response = await apiFetch("/rooms");

    const data = await response.json();

    const userId = localStorage.getItem("userId");
    const container = document.getElementById("rooms-container");

    data.roomsInfo.forEach(roomInfo => {
        const isCreator = roomInfo.creator.userId === userId;
        appendRoomToRoomsContainer(
            container,
            roomInfo,
            isCreator
        );
    });
}

export { loadRooms };