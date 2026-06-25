// socket-events.js

import { updateOnlineUserList } from "../dashboard-services.js";
import { appendMessageToChatList } from "./message-view.js";
import { handleSendMessage } from "./message-services.js";

function registerSocketEvents(socket, messagesElement, onlineUsersElement) {
    // Handle update on online users list upon user joining or leaving the room
    socket.on("userJoined", (onlineUsers) => {
        updateOnlineUserList(onlineUsersElement, onlineUsers);
    });
    socket.on("userLeft", (onlineUsers) => {
        updateOnlineUserList(onlineUsersElement, onlineUsers);
    });

    // Handle user enter room event
    socket.on("userEntered", ({ members, messages }) => {
        // members is a list of { userId, username }
        console.log("\Users: ");
        members.forEach((member, index) => {
            console.log(`${index+1}. ${member.username} [${member.userId}]`);
        });
        // members.map(member => (
        //     <div key={member.userId}>
        //         {member.username}
        //     </div>
        // ));

        // messages is a list of Message documents
        console.log("\nMessages: ");
        messages.forEach((message, index) => {
            console.log(`${index+1}. ${message.userId} [${message.content}]`);
        });
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

// Handle socket communication with server
function startSession(socket) {
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const messagesElement = document.getElementById("messages");
    const onlineUsersElement = document.getElementById("onlineUsers");

    const userId = localStorage.getItem("userId");

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

    registerSocketEvents(socket, messagesElement, onlineUsersElement);
}

export { startSession };