// room-view.js

import { enableRoomBackBtn } from "./room-back-btn-handler.js";
import { parseResponse } from "../utils/response-parser.js";
import { getRoomInfo } from "./room-api.js";
import { dashboardState } from "../states/dashboard-state.js";
import { getRoomCodeFromParams } from "../dashboard/conversation/services.js";

// Render the room info and user info on Dashboard page UI, after user entering a room
async function renderBasicGui() {
    // Render the back-to-dashboard button, since the user is currently inside a room
    enableRoomBackBtn();

    // Fetch user public id from local storage
    const userId = localStorage.getItem("userId");

    // Fetch room code from the url bar of the user's browser
    const roomCodeFromUrl = getRoomCodeFromParams();

    /* 
     * Fetch room code and room name of the current room from dashboardState
     * Note that these information should be updated upon user firing an
     * "enter room" event to server when they "enter" the room, and successfully 
     * receiving these information from server 
    */
    let roomCode;
    let roomName;
    
    const currentRoom = dashboardState.currentRoom;
    if (currentRoom && currentRoom.roomCode === roomCodeFromUrl) {
        // There is a record of this <roomCode-roomName> pair in dashboardState
        // Use them directly
        roomCode = roomCodeFromUrl;
        roomName = currentRoom.roomName;
        console.log("Loaded existing room info");
    } else {
        // Fallback: there is no record of the pair in dashboardState
        // Fetch them from the server
        const result = await parseResponse(await getRoomInfo(roomCodeFromUrl)); // roomCode and roomName
        roomCode = result.data.roomInfo.roomCode;
        roomName = result.data.roomInfo.roomName;
        // Record the pair by updating dashboardState
        dashboardState.currentRoom = result.data.roomInfo;
        console.log("Fetched room info from server");
    }

    // Update the public id of this user on Dashboard page UI
    const userIdInChatElement = document.getElementById("userIdInChat");
    if (userIdInChatElement) userIdInChatElement.textContent = `User ID: ${userId}`;

    // Update the code of the room on Dashboard page UI
    const roomCodeInChatElement = document.getElementById("roomCodeInChat");
    if (roomCodeInChatElement) roomCodeInChatElement.textContent = `Room Code: ${roomCode}`;

    // Update the name of the room on Dashboard page UI
    const titleElement = document.getElementById("title");
    if (titleElement)titleElement.textContent = roomName;
}

// Update the rooms container upon modification to the room list (create room, join room, etc.)
function appendRoomToRoomsContainer(containerDiv, roomInfo, role) {
    // A container that wraps around each roomBtn-leaveBtn pair
    const roomRow = document.createElement("div");
    roomRow.className = "room-row";

    // Room button; enter the room upon clicking
    const roomBtn = document.createElement("button");
    roomBtn.className = "room-btn";
    roomBtn.dataset.roomCode = roomInfo.roomCode;
    roomBtn.title = "Enter room";
    roomBtn.setAttribute("aria-label", "Enter room");

    const roomName = document.createElement("span");
    roomName.textContent = roomInfo.roomName;
    roomBtn.appendChild(roomName);

    // Leave button; leave the room upon clicking
    const leaveBtn = document.createElement("button");
    leaveBtn.className = "leave-btn";
    leaveBtn.dataset.roomCode = roomInfo.roomCode;
    leaveBtn.title = "Leave room";
    leaveBtn.setAttribute("aria-label", "Leave room");

    const leaveIcon = document.createElement("img");
    leaveIcon.src = "/assets/leave.svg";
    leaveIcon.alt = "Leave room";
    leaveIcon.className = "leave-icon";
    leaveBtn.appendChild(leaveIcon);

    // Append buttons to the wrapper
    roomRow.appendChild(roomBtn);
    roomRow.appendChild(leaveBtn);

    // Delete button; enabled only for creator of the room
    // Delete the room from the database upon clicking
    if (role === "creator") {
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.roomCode = roomInfo.roomCode;
        deleteBtn.title = "Delete room";
        deleteBtn.setAttribute("aria-label", "Delete room");

        const deleteIcon = document.createElement("img");
        deleteIcon.src = "/assets/delete.svg";
        deleteIcon.alt = "Delete";
        deleteIcon.className = "delete-icon";
        deleteBtn.appendChild(deleteIcon);

        roomRow.appendChild(deleteBtn);
    }

    // Append the container to the rooms container (the list of containers about room)
    containerDiv.appendChild(roomRow);
}

function updateRoomCodeInURL(roomCode) {
    // Modify the url to reflect user entering this room without refreshing the page
    history.pushState({}, "", `/dashboard?room=${roomCode}`);
}

export { renderBasicGui, appendRoomToRoomsContainer, updateRoomCodeInURL };