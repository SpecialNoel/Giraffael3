// session-handler.js

import * as ClientServices from "/static/client-services.js";

function startSession(socket, roomCode, roomName) {
    const username = document.getElementById("username").value.trim();

    // Update code and name of the room, as well as user info, on user GUI
    const roomCodeInChatElement = document.getElementById("roomCodeInChat");
    if (roomCodeInChatElement) roomCodeInChatElement.textContent = `Room code: ${roomCode}`;
    const titleElement = document.getElementById("title");
    if (titleElement)titleElement.textContent = roomName;
    const usernameInChatElement = document.getElementById("usernameInChat");
    if (usernameInChatElement) usernameInChatElement.textContent = `Username: ${username}`;
    
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const messagesElement = document.getElementById("messages");
    const onlineUsersElement = document.getElementById("onlineUsers");

    // Upon form submission, send the input message (if any) to the server
    form.addEventListener("submit", (e) => {
        // Prevent web page reloading upon form submission
        e.preventDefault();
        ClientServices.handleSendMessage(
            username,
            messagesElement,
            input,
            socket,
        );
    });

    // Handle update on online users list upon user joining or leaving the room
    socket.on("user joined", (onlineUsers) =>
        ClientServices.updateOnlineUserList(onlineUsersElement, onlineUsers),
    );
    socket.on("user left", (onlineUsers) =>
        ClientServices.updateOnlineUserList(onlineUsersElement, onlineUsers),
    );

    // Handle client socket receiving chat messages sent by connected clients
    socket.on("chat message", (senderId, msg) => {
        ClientServices.appendMessageToChatList(messagesElement, senderId, msg);
    });
}

export default startSession;
