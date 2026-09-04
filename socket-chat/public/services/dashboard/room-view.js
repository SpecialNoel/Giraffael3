// room-view.js

import { enableRoomBackBtn } from "./room-back-btn-handler.js";
import { parseResponse } from "../utils/api.js";
import { handleGetUserInfoRequest } from "../settings/setting-api.js";
import { getRoomInfo } from "./room-api.js";
import { dashboardState } from "../states/dashboard-state.js";
import { getRoomCodeFromParams } from "../dashboard/conversation/services.js";

// Render the room info and user info on Dashboard page UI, after user entering a room
async function renderBasicGui() {
    // Render the back-to-dashboard button, since the user is currently inside a room
    enableRoomBackBtn();

    const userIdResult = await parseResponse(await handleGetUserInfoRequest("user-id"));
    if (!userIdResult.success) {
        alert("Error in fetching user id");
        return;
    }
    const userId = userIdResult.data.userId;

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

    // Room button; enter the room when clicked
    const roomBtn = document.createElement("button");
    roomBtn.className = "room-btn";
    roomBtn.dataset.roomCode = roomInfo.roomCode;
    roomBtn.title = "Enter room";
    roomBtn.setAttribute("aria-label", "Enter room");

    const roomName = document.createElement("span");
    roomName.textContent = roomInfo.roomName;
    roomBtn.appendChild(roomName);

    // Hover panel; display brief room info upon hovering
    const roomContainer = document.createElement("div");
    roomContainer.classList.add("room-container");
    const hoverPanel = document.createElement("div");
    hoverPanel.classList.add("room-hover-panel");
    const roomCodeElement = document.createElement("p");
    roomCodeElement.textContent = `Room Code: ${roomInfo.roomCode}`;
    const roomNameElement = document.createElement("p");
    roomNameElement.textContent = `Room Name: ${roomInfo.roomName}`;
    hoverPanel.appendChild(roomCodeElement);
    hoverPanel.appendChild(roomNameElement);

    roomContainer.appendChild(roomBtn);
    roomContainer.appendChild(hoverPanel);

    // Leave button; leave the room when clicked
    const leaveBtn = document.createElement("button");
    leaveBtn.className = "leave-btn";
    leaveBtn.dataset.roomCode = roomInfo.roomCode;
    leaveBtn.title = "Leave room";
    leaveBtn.setAttribute("aria-label", "Leave room");

    const leaveIcon = document.createElement("img");
    leaveIcon.src = "/assets/leave_icon.svg";
    leaveIcon.alt = "Leave room";
    leaveIcon.className = "leave-icon";
    leaveBtn.appendChild(leaveIcon);

    // Append buttons to the wrapper
    roomRow.appendChild(roomContainer);
    roomRow.appendChild(leaveBtn);

    // Delete button; enabled only for creator of the room
    // Delete the room from the database when clicked
    if (role === "creator") {
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.roomCode = roomInfo.roomCode;
        deleteBtn.title = "Delete room";
        deleteBtn.setAttribute("aria-label", "Delete room");

        const deleteIcon = document.createElement("img");
        deleteIcon.src = "/assets/delete_icon.svg";
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

// Render the list of current active users in the room on Dashboard page UI
function renderMembers(membersElement, emptyMessageElement, membersHeadingElement, members) {
    // Render the member list container on displaying the empty message or not
    emptyMessageElement.hidden = members.length > 0;
    membersElement.hidden = members.length === 0;

    // Render the member list by appending any user that is currently active
    if (members.length > 0) {
        // Update the header
        membersHeadingElement.textContent = `Members (${members.length})`;

        // Empty the list first
        membersElement.innerHTML = "";

        // For each user that is currently active in the room, add info about the user to the list
        members.forEach(({ userId, username }) => {
            const item = document.createElement("li");
            item.textContent = `[${username}]: ${userId}`;
            membersElement.appendChild(item);
            // Scroll the browser window to the bottom of the members element
            membersElement.scrollTop = membersElement.scrollHeight;
        });
    }
}

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

export {
    renderBasicGui, 
    appendRoomToRoomsContainer, 
    updateRoomCodeInURL,
    renderMembers,
    loadRooms
};