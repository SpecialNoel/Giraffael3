// room-view.js

// Update the room info and user info on Dashboard page UI
function updateBasicGui() {
    // Fetch room code from the url bar of the user's browser
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get("room");
    if (!roomCode) return;

    // TODO: Handle the issue where the room name cannot be obtained the same way as the room code
    const roomName = "default_roomName";
    // Fetch user public id
    const userId = localStorage.getItem("userId");

    // Update the name of the room on Dashboard page UI
    const titleElement = document.getElementById("title");
    if (titleElement)titleElement.textContent = roomName;

    // Update the code of the room on Dashboard page UI
    const roomCodeInChatElement = document.getElementById("roomCodeInChat");
    if (roomCodeInChatElement) roomCodeInChatElement.textContent = `Room Code: ${roomCode}`;

    // Update the public id of this user on Dashboard page UI
    const userIdInChatElement = document.getElementById("userIdInChat");
    if (userIdInChatElement) userIdInChatElement.textContent = `User ID: ${userId}`;
}

// Update the list of current online users in the room on Dashboard page UI
function updateOnlineUserList(onlineUsersElement, onlineUsers) {
    // Empty the list first
    onlineUsersElement.innerHTML = "";

    // For each user that is currently online in the room, add info about the user to the list
    onlineUsers.forEach(({ userId, username }) => {
        const item = document.createElement("li");
        item.textContent = `[${username}]: ${userId}`;
        onlineUsersElement.appendChild(item);
        // Scroll the browser window to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
    });
}

// Update the message history in the room on Dashboard page UI
function updateMessageHistoryList(messagesElement, messages) {
    // Empty the history first
    messagesElement.innerHTML = "";

    // For each message that was sent over the room, add info about the message to the history
    messages.forEach(({ messageObjectId, userId, username, content, type }) => {
        const item = document.createElement("li");
        item.textContent = `[${username}]: ${content}`;
        messagesElement.appendChild(item);
        // Scroll the browser window to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
    });
}

// Update the rooms container upon modification to the room list (create room, join room, etc.)
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

    // Append the container to the rooms container (the list of containers about room)
    containerDiv.appendChild(roomRow);
}

export { updateBasicGui, 
         updateOnlineUserList, 
         updateMessageHistoryList,
         appendRoomToRoomsContainer };