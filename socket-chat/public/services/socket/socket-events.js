// socket-events.js

import { renderBasicGui } from "../dashboard/room-view.js";
import { renderMembers } from "../dashboard/members-services.js";
import { appendMessage } from "../dashboard/conversation/services.js";
import { storeMessageToState, renderConversation } from "../dashboard/conversation/enter-room-services.js";
import { sendMessage } from "./message-services.js";
import { dashboardState, updateRoomState } from "../states/dashboard-state.js";

// Set up socket events
function registerSocketEvents(socket, 
                              conversationElement, 
                              membersElement, 
                              emptyMessageElement,
                              membersHeadingElement) {
    // Handle update on active users list upon user joining or leaving the room
    socket.on("userJoined", (data) => {
        // Display "user join room" message to this user
        alert(data.msg);
        console.log(`A user has joined room ${data.roomCode}.`);    
        // Update the members field on the dashboard    
        // members is a list of { userId, username }
        renderMembers(membersElement, emptyMessageElement, membersHeadingElement, data.members);
    });
    socket.on("userLeft", (data) => {
        // Display "user left room" message to this user
        alert(data.msg);
        console.log(`A user has left room ${data.roomCode}.`);
        // Update the members field on the dashboard    
        // members is a list of { userId, username }
        renderMembers(membersElement, emptyMessageElement, membersHeadingElement, data.members);
    });

    // Handle user enter room event
    socket.on("userEntered", async (data) => {
        // Ignore this received response (data) if the room code in it is stale/old
        if (data.roomInfo.roomCode !== dashboardState.pendingRoomCode) {
            // Render only the basics (room name, room code, user id) to the dashboard
            await renderBasicGui();
            return;
        }

        // Update Dashboard page upon enter room success
        dashboardState.currentRoom = data.roomInfo;
        updateRoomState(data.roomInfo.roomCode, {
            members: data.members,
            messages: [...[], ...data.messages],
            cursor: data.nextCursor,
            hasMore: data.hasMore        
        }); // update the state for next message-fetching
        await renderBasicGui();
        renderMembers(membersElement, emptyMessageElement, membersHeadingElement, data.members);
        await renderConversation(conversationElement, data.messages);
    });
    // Handle user exit room event
    socket.on("userExited", (data) => {
        console.log("Members: ", data.members);
    });

    // Handle client socket receiving chat text messages sent by connected clients
    socket.on("chatMessageReceived", (data) => {
        const username = data.senderUsername;
        const content = data.content;
        const message = { username, content };
        // Update the messages list of the room in the dashboard state
        storeMessageToState(data.roomCode, message);
        // Update the conversation element by appending the received message to it
        appendMessage(conversationElement, content, username);
    });

    // Handle user sending a message without being inside a room first
    socket.on("messageRejectedNoActiveRoom", () => {
        alert("Failed to send the message. You are not currently inside a room.");
    });

    // Handle room deletion event
    socket.on("roomDeleted", (data) => {
        alert(data.msg);
        console.log(`Room ${data.roomCode} has been deleted.`)        
        // Navigate to the dashboard after receiving the room deletion notification
        window.location.href = "/dashboard";
    });
}

// Start socket communication with server with the created socket by setting up the socket events
function startSession(socket) {
    const form = document.getElementById("form");
    const inputElement = document.getElementById("message-input");
    const conversationElement = document.getElementById("conversation");
    const membersElement = document.getElementById("members");
    const emptyMessageElement = document.getElementById("emptyMessage");
    const membersHeadingElement = document.getElementById("membersHeading");

    const userId = localStorage.getItem("userId");

    // Upon receiving form submission, send the input message (if any) to the server
    form.addEventListener("submit", (e) => {
        // Prevent web page reloading upon form submission
        e.preventDefault();

        // Send the input message to server (for which server will then relay to other active users in the room)
        sendMessage(
            userId,
            conversationElement,
            inputElement,
            socket,
        );
    });

    // Set up socket events
    registerSocketEvents(socket, 
                         conversationElement, 
                         membersElement, 
                         emptyMessageElement, 
                         membersHeadingElement);
}

export { startSession };