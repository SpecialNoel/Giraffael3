// socket-events.js

import { renderBasicGui } from "../dashboard/room-view.js";
import { renderMemberList } from "../dashboard/member-list-services.js";
import { renderConversation, appendMessage } from "../dashboard/conversation-services.js";
import { appendMessageToChatList } from "./message-view.js";
import { handleSendMessage } from "./message-services.js";
import { dashboardState } from "../states/dashboard-state.js";

// Set up socket events
function registerSocketEvents(socket, 
                              conversationElement, 
                              memberListElement, 
                              emptyMessageElement,
                              memberListHeadingElement) {
    // Handle update on active users list upon user joining or leaving the room
    socket.on("userJoined", (data) => {
        alert(data.msg);
        console.log(`An user has joined room ${data.roomCode}.`);        
        // memberList is a list of { userId, username }
        renderMemberList(memberListElement, emptyMessageElement, memberListHeadingElement, data.memberList);
    });
    socket.on("userLeft", (data) => {
        alert(data.msg);
        console.log(`An user has left room ${data.roomCode}.`);
        renderMemberList(memberListElement, emptyMessageElement, memberListHeadingElement, data.memberList);
    });

    // Handle user enter room event
    socket.on("userEntered", async (data) => {
        // Ignore this received response (data) if the room code inside it is a stale data
        if (data.roomInfoForDisplay.roomCode !== dashboardState.pendingRoomCode) {
            await renderBasicGui();
            return;
        }

        // Update Dashboard page upon enter room success
        dashboardState.currentRoom = data.roomInfoForDisplay;
        dashboardState.roomPaginationStates.set(data.roomInfoForDisplay.roomCode, {
            cursor: data.nextCursor,
            hasMore: data.hasMore        
        }); // update the state for next message-fetching
        await renderBasicGui();
        renderMemberList(memberListElement, emptyMessageElement, memberListHeadingElement, data.memberList);
        renderConversation(conversationElement, data.messages);
    });
    // Handle user exit room event
    socket.on("userExited", (data) => {
        console.log("Members: ", data.memberList);
    });

    // Handle client socket receiving chat text messages sent by connected clients
    socket.on("chatMessageReceived", (data) => {
        appendMessage(conversationElement, data.content, data.senderUsername);
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
    const memberListElement = document.getElementById("memberList");
    const emptyMessageElement = document.getElementById("emptyMessage");
    const memberListHeadingElement = document.getElementById("memberListHeading");

    const userId = localStorage.getItem("userId");

    // Upon receiving form submission, send the input message (if any) to the server
    form.addEventListener("submit", (e) => {
        // Prevent web page reloading upon form submission
        e.preventDefault();

        // Send the input message to server (for which server will then relay to other active users in the room)
        handleSendMessage(
            userId,
            conversationElement,
            inputElement,
            socket,
        );
    });

    // Set up socket events
    registerSocketEvents(socket, 
                         conversationElement, 
                         memberListElement, 
                         emptyMessageElement, 
                         memberListHeadingElement);
}

export { startSession };