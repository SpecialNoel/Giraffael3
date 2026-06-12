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

// Send the input message to server (for which server will then relay to other online users in the room)
function handleSendMessage(username, messagesElement, input, socket) {
    if (input.value) {
        // Emit the chat message to server, with a 5-second timeout
        // This reaches the same functionality as "emiWithAck()"
        socket.timeout(5000).emit("chat message", username, input.value, (err, res) => {
            if (err) {
                console.log("Server did not acknowledge the transmission of this chat message in the given delay.");
            } else {
                console.log(`Server acknowledgement: ${res.status}`);
            }
        });

        // Append client message directly to the chat list
        appendMessageToChatList(username, messagesElement, input.value);
        input.value = "";
    }
}

// Update the current online users in the room
function updateOnlineUserList(onlineUsersElement, onlineUsers) {
    onlineUsersElement.innerHTML = "";
    onlineUsers.forEach((username) => {
        const item = document.createElement("li");
        item.textContent = username;
        onlineUsersElement.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}

// Append the message to the chat list
function appendMessageToChatList(username, messagesElement, msg) {
    const item = document.createElement("li");
    item.textContent = username + ": " + msg;
    messagesElement.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

// Handle socket communication with server
function startSession(socket) {
    function updateBasicGui() {
        // Update code and name of the room, as well as user info, on user GUI
        const roomCodeInChatElement = document.getElementById("roomCodeInChat");
        if (roomCodeInChatElement) roomCodeInChatElement.textContent = `Room code: ${roomCode}`;

        const titleElement = document.getElementById("title");
        if (titleElement)titleElement.textContent = roomName;

        const usernameInChatElement = document.getElementById("usernameInChat");
        if (usernameInChatElement) usernameInChatElement.textContent = `Username: ${username}`;
    }

    const roomCode = "default_roomCode";
    const roomName = "default_roomName";
    const username = "default_username";
    updateBasicGui(roomCode, roomName, username);
    
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const messagesElement = document.getElementById("messages");
    const onlineUsersElement = document.getElementById("onlineUsers");

    // Upon form submission, send the input message (if any) to the server
    form.addEventListener("submit", (e) => {
        // Prevent web page reloading upon form submission
        e.preventDefault();
        handleSendMessage(
            username,
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