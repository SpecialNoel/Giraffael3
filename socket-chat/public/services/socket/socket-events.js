// socket-events.js

import { updateBasicGui, 
         updateMemberList, 
         updateConversation } from "../dashboard/room-view.js";
import { appendMessageToChatList } from "./message-view.js";
import { handleSendMessage } from "./message-services.js";

// Set up socket events
function registerSocketEvents(socket, 
                              conversationElement, 
                              memberListElement, 
                              emptyMessageElement,
                              memberListHeadingElement) {
    // Handle update on active users list upon user joining or leaving the room
    socket.on("userJoined", (memberList) => {
        // memberList is a list of { userId, username }
        updateMemberList(memberListElement, emptyMessageElement, memberListHeadingElement, memberList);
    });
    socket.on("userLeft", (memberList) => {
        updateMemberList(memberListElement, emptyMessageElement, memberListHeadingElement, memberList);
    });

    // Handle user enter room event
    socket.on("userEntered", async ({ memberList, conversation, roomInfoForDisplay }) => {
        // Update Dashboard page upon enter room success
        sessionStorage.setItem(
            "currentRoom",
            JSON.stringify(roomInfoForDisplay)
        );
        await updateBasicGui();
        updateMemberList(memberListElement, emptyMessageElement, memberListHeadingElement, memberList);
        updateConversation(conversationElement, conversation);
    });

    socket.on("userLeft", ({ memberList, conversation }) => {
        updateMemberList(memberListElement, emptyMessageElement, memberListHeadingElement, memberList);
        updateConversation(conversationElement, conversation);
    });

    // Handle client socket receiving chat text messages sent by connected clients
    socket.on("chatMessageReceived", (tmpId, msgContent) => {
        appendMessageToChatList(conversationElement, tmpId, msgContent, "received");
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
            input,
            socket,
        );
    });

    // Set up socket events
    registerSocketEvents(socket, conversationElement, memberListElement, emptyMessageElement, memberListHeadingElement);
}

export { startSession };