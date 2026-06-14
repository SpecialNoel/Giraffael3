// socket-service.js

// Create a socket and send the JWT token to server for authentication using the socket
function sendTokenToServer() {
    const token = localStorage.getItem("token");
    return new Promise((resolve, reject) => {
        const socket = io({
            auth: { token }
        });

        socket.once("connect", () => resolve(socket));
        socket.once("connect_error", reject);
    });
}

// Update the current online users in the room
function updateOnlineUserList(onlineUsersElement, onlineUsers) {
    onlineUsersElement.innerHTML = "";
    onlineUsers.forEach((userId) => {
        const item = document.createElement("li");
        item.textContent = userId;
        onlineUsersElement.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}

// Append the message to the chat list
function appendMessageToChatList(messagesElement, userId, msg) {
    const item = document.createElement("li");
    item.textContent = userId + ": " + msg;
    messagesElement.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

// Send the input message to server (for which server will then relay to other online users in the room)
function handleSendMessage(userId, messagesElement, input, socket) {
    if (input.value) {
        // Emit the chat message to server, with a 5-second timeout
        // This reaches the same functionality as "emiWithAck()"
        socket.timeout(5000).emit("chat message", userId, input.value, (err, res) => {
            if (err) {
                console.log("Server did not acknowledge the transmission of this chat message in the given delay.");
            } else {
                console.log(`Server acknowledgement: ${res.status}`);
            }
        });

        // Append client message directly to the chat list
        appendMessageToChatList(messagesElement, userId, input.value);
        input.value = "";
    }
}

// Handle socket communication with server
function startSession(socket) {
    function updateBasicGui(roomCode, roomName, userId) {
        // Update code and name of the room, as well as user info, on user GUI
        const roomCodeInChatElement = document.getElementById("roomCodeInChat");
        if (roomCodeInChatElement) roomCodeInChatElement.textContent = `Room code: ${roomCode}`;

        const titleElement = document.getElementById("title");
        if (titleElement)titleElement.textContent = roomName;

        const userIdInChatElement = document.getElementById("userIdInChat");
        if (userIdInChatElement) userIdInChatElement.textContent = `User Id: ${userId}`;
    }

    const roomCode = "default_roomCode";
    const roomName = "default_roomName";
    const userId = localStorage.getItem("userId");
    updateBasicGui(roomCode, roomName, userId);
    
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const messagesElement = document.getElementById("messages");
    const onlineUsersElement = document.getElementById("onlineUsers");

    // Upon form submission, send the input message (if any) to the server
    form.addEventListener("submit", (e) => {
        // Prevent web page reloading upon form submission
        e.preventDefault();
        handleSendMessage(
            userId,
            messagesElement,
            input,
            socket,
        );
    });

    // Handle update on online users list upon user joining or leaving the room
    socket.on("user joined", (onlineUsers) =>
        updateOnlineUserList(onlineUsersElement, onlineUsers),
    );
    socket.on("user left", (onlineUsers) =>
        updateOnlineUserList(onlineUsersElement, onlineUsers),
    );

    // Handle client socket receiving chat messages sent by connected clients
    socket.on("chat message", (senderId, msg) => {
        appendMessageToChatList(messagesElement, senderId, msg);
    });
}

export { sendTokenToServer, startSession };