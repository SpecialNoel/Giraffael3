// client.js

import * as ClientServices from "/static/client-services.js";

function startConnection(username) {
    /*
    * io() by default tries to connect the client to the host/server
    * that serves the page (this home page in this case)
    */
    const socket = io();

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

export { startConnection }
