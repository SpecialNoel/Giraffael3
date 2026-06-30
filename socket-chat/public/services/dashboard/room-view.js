// room-view.js

function updateBasicGui() {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get("room");
    if (!roomCode) return;

    const roomName = "default_roomName";
    const userId = localStorage.getItem("userId");

    // Update code and name of the room, as well as user info, on user GUI
    const titleElement = document.getElementById("title");
    if (titleElement)titleElement.textContent = roomName;

    const roomCodeInChatElement = document.getElementById("roomCodeInChat");
    if (roomCodeInChatElement) roomCodeInChatElement.textContent = `Room Code: ${roomCode}`;

    const userIdInChatElement = document.getElementById("userIdInChat");
    if (userIdInChatElement) userIdInChatElement.textContent = `User ID: ${userId}`;
}

// Update the current online users in the room
function updateOnlineUserList(onlineUsersElement, onlineUsers) {
    onlineUsersElement.innerHTML = "";
    onlineUsers.forEach(({ userId, username }) => {
        const item = document.createElement("li");
        item.textContent = `[${username}]: ${userId}`;
        onlineUsersElement.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}

// Update the message history in the room
function updateMessageHistoryList(messagesElement, messages) {
    messagesElement.innerHTML = "";
    messages.forEach(({ messageObjectId, userId, username, content, type }) => {
        const item = document.createElement("li");
        item.textContent = `[${username}]: ${content}`;
        messagesElement.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}
// Update the rooms container upon room list modification (create room, join room, refresh page, etc.)
function appendRoomToRoomsContainer(containerDiv, roomInfo, isCreatorOfRoom) {
    // A container that wraps around each roomBtn-leaveBtn pair
    const roomRow = document.createElement("div");
    roomRow.className = "room-row";

    // Room button; enter the room upon clicking
    const roomBtn = document.createElement("button");
    roomBtn.className = "room-btn";
    roomBtn.dataset.roomCode = roomInfo.roomCode;
    roomBtn.textContent = roomInfo.roomName;

    // Leave button; leave the room upon clicking
    const leaveBtn = document.createElement("button");
    leaveBtn.className = "leave-btn";
    leaveBtn.dataset.roomCode = roomInfo.roomCode;
    leaveBtn.textContent = "Leave";

    // Append buttons to the wrapper
    roomRow.appendChild(roomBtn);
    roomRow.appendChild(leaveBtn);

    // Delete button; enabled only for creator of the room
    // Delete the room from the database upon clicking
    if (isCreatorOfRoom) {
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.roomCode = roomInfo.roomCode;
        deleteBtn.textContent = "Delete";
        roomRow.appendChild(deleteBtn);
    }

    // Append the wrapper to the rooms container
    containerDiv.appendChild(roomRow);
}

export { updateBasicGui, 
         updateOnlineUserList, 
         updateMessageHistoryList,
         appendRoomToRoomsContainer };