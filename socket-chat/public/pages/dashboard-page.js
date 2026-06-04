// dashboard-page.js

import handleDashboard from "../services/dashboard-service.js";

// Retrieve the info upon user refreshing the dashboard page
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
    roomsInfo.forEach(newRoomInfo => {
        const newRoomBtn = document.createElement("button");
        newRoomBtn.className = "room-btn";
        newRoomBtn.dataset.roomCode = newRoomInfo.roomCode;
        newRoomBtn.textContent = newRoomInfo.roomName;
        containerDiv.appendChild(newRoomBtn);
    });
});

// Handle user dashboard services
handleDashboard()