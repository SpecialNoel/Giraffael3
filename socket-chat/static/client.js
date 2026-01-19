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
    // const toggleButton = document.getElementById("toggle-btn");

    // Connect or disconnect the client from server via the toggle button
    // toggleButton.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   if (socket.connected) {
    //     toggleButton.innerText = "Connect";
    //     socket.disconnect();
    //   } else {
    //     toggleButton.innerText = "Disconnect";
    //     socket.connect();
    //   }
    // });

    // Upon form submission, send the input message (if any) to the server
    form.addEventListener("submit", (e) => {
        // Prevent web page reloading upon form submission
        e.preventDefault();
        ClientServices.handleFormSubmission(
            username,
            messagesElement,
            input,
            socket,
        );
    });

    // Handle update on online users list upon user join or leave the room
    socket.on("user joined", (onlineUsers) =>
        ClientServices.updateOnlineUserList(onlineUsersElement, onlineUsers),
    );
    socket.on("user left", (onlineUsers) =>
        ClientServices.updateOnlineUserList(onlineUsersElement, onlineUsers),
    );

    // Handle client socket receiving chat messages sent by connected clients
    socket.on("chat message", (senderId, msg) => {
        ClientServices.addMessageToChatList(messagesElement, senderId, msg);
    });

    // A catch-all listeners; will be called for any incoming event
    // socket.onAny((eventName, ...args) => {
    //   console.log(`Event: ${eventName}`);
    //   console.log(`Content: ${args}`);
    // });

    // A catch-all listeners; will be called for any outgoing event
    // socket.onAnyOutgoing((eventName, ...args) => {
    //   console.log(`Event: ${eventName}`);
    //   console.log(`Content: ${args}`);
    // });
}

export { startConnection }
