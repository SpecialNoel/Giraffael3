// rooms-container-handler.js

// Update the rooms container upon room list modification (create room, join room, refresh page)
function appendRoomToRoomsContainer(containerDiv, roomInfo) {
    // A container that wraps around each roomBtn-leaveBtn pair
    const roomRow = document.createElement("div");
    roomRow.className = "room-row";

    // Room button
    const roomBtn = document.createElement("button");
    roomBtn.className = "room-btn";
    roomBtn.dataset.roomCode = roomInfo.roomCode;
    roomBtn.textContent = roomInfo.roomName;

    // Leave button
    const leaveBtn = document.createElement("button");
    leaveBtn.className = "leave-btn";
    leaveBtn.dataset.roomCode = roomInfo.roomCode;
    leaveBtn.textContent = "Leave";

    // Append buttons to the wrapper
    roomRow.appendChild(roomBtn);
    roomRow.appendChild(leaveBtn);

    // Append the wrapper to the rooms container
    containerDiv.appendChild(roomRow);
}

export { appendRoomToRoomsContainer };