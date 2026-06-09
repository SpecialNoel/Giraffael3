// dashboard-page.js

import { handleDashboard } from "../services/dashboard-service.js";
import { appendRoomToRoomsContainer } from "../utils/rooms-container-handler.js";

// Retrieve room info for rooms container, upon user refreshing the dashboard page
window.addEventListener("DOMContentLoaded", async () => {
    // Retrieve user _id
    const userId = localStorage.getItem("_id");

    // Retrieve info about all rooms the user has joined from server
    const response = await fetch("/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId }) // TODO: update this after implementing authentication to avoid using POST to just retrieve information
    });
    const data = await response.json();
    const roomsInfo = data.roomsInfo;

    // Append each room as a room button to rooms container
    const containerDiv = document.getElementById("rooms-container");
    roomsInfo.forEach(roomInfo => {
        // Determine whether the user is the creator of the room
        const isCreatorOfRoom = roomInfo.creatorId.toString() === userId.toString();
        appendRoomToRoomsContainer(containerDiv, roomInfo, isCreatorOfRoom);
    });
});

// Handle user dashboard services
handleDashboard();