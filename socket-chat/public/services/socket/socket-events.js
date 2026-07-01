// socket-events.js

import { updateBasicGui, 
         updateOnlineUserList, 
         updateMessageHistoryList } from "../dashboard/room-view.js";
import { appendMessageToChatList } from "./message-view.js";
import { handleSendMessage } from "./message-services.js";

// Set up socket events
function registerSocketEvents(socket, messagesElement, onlineUsersElement) {
    // Handle update on online users list upon user joining or leaving the room
    socket.on("userJoined", (onlineUsers) => {
        // onlineUsers is a list of { userId, username }
        updateOnlineUserList(onlineUsersElement, onlineUsers);
    });
    socket.on("userLeft", (onlineUsers) => {
        updateOnlineUserList(onlineUsersElement, onlineUsers);
    });

    // Handle user enter room event
    socket.on("userEntered", async ({ onlineUsers, messages, roomInfoForDisplay }) => {
        // Update Dashboard page upon enter room success
        sessionStorage.setItem(
            "currentRoom",
            JSON.stringify(roomInfoForDisplay)
        );
        await updateBasicGui();
        updateOnlineUserList(onlineUsersElement, onlineUsers);
        updateMessageHistoryList(messagesElement, messages);
    });

    socket.on("userLeft", ({ onlineUsers, messages }) => {
        updateOnlineUserList(onlineUsersElement, onlineUsers);
        updateMessageHistoryList(messagesElement, messages);
    });

    // Handle client socket receiving chat messages sent by connected clients
    socket.on("chatMessageReceived", (senderId, msgContent) => {
        appendMessageToChatList(messagesElement, senderId, msgContent);
    });

    // Handle room deletion event
    socket.on("roomDeleted", ({ roomCode, msg }) => {
        alert(msg);
        console.log(`Room ${roomCode} has been deleted.`)        
        // Navigate to the dashboard after receiving the room deletion notification
        window.location.href = "/dashboard";
    });
}

// Start socket communication with server with the created socket by setting up the socket events
function startSession(socket) {
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const messagesElement = document.getElementById("messages");
    const onlineUsersElement = document.getElementById("onlineUsers");

    const userId = localStorage.getItem("userId");

    // Upon receiving form submission, send the input message (if any) to the server
    form.addEventListener("submit", (e) => {
        // Prevent web page reloading upon form submission
        e.preventDefault();

        // Send the input message to server (for which server will then relay to other online users in the room)
        handleSendMessage(
            userId,
            messagesElement,
            input,
            socket,
        );
    });

    // Set up socket events
    registerSocketEvents(socket, messagesElement, onlineUsersElement);
}

export { startSession };