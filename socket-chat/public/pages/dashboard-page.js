// dashboard-page.js

import { createAuthenticatedSocket } from "../services/socket/socket-client.js";
import { initializeDashboard } from "../services/dashboard/dashboard-initializer.js";
import { setupConversationScroller } from "../services/dashboard/conversation-scroller-setter.js";
import { startSession } from "../services/socket/socket-events.js";

// Initialize the socket used to communicate with server, and add event listeners for dashboard services
// to components on the Dashboard page
window.addEventListener("DOMContentLoaded", async () => {
    try {
        /* 
        * Create a socket and send the JWT token to server for authentication for socket events.
        * This step needs to be done first for the server to authenticate the client.
        * Once the client is authenticated (i.e. is trusted by server), server can
        *   - use client information such as userObjectId and userId directly without the client
        *   - send these information to server for each HTTP API endpoint operation and 
        *   - other operations.
        * TLDR: JWT token verification comes after user sign-in, but before every other 
        *       dashboard services.
        */
        const socket = await createAuthenticatedSocket();

        // roomPaginationStates: { roomCode: { cursor, hasMore } }
        // A mapping of room codes to cursor and hasMore fields to keep track of the next batch of messages to fetch
        // A cursor indicates where the last fetched message was located in the database
        // A hasMore field indicates whether there are more messages from the room to fetch
        const roomPaginationStates = new Map();

        // Set up event listeners for user dashboard services (HTTP endpoints operations)
        initializeDashboard(socket, roomPaginationStates);
        console.log("Initialized dashboard");

        // Set up scroller in the conversation element to fetch and display more older messages upon user scrolling upwards
        const conversationElement = document.getElementById("conversation");
        await setupConversationScroller(conversationElement, roomPaginationStates);

        // Start socket communication with server with the created socket by setting up the socket events
        startSession(socket, roomPaginationStates);
        console.log("Started session");
    } catch (err) {
        // If any error occurs, alert the error message to user and redirect them back to the sign in page
        alert("Failed to enter dashboard page. Return to sign-in page.");
        console.error(err);
        window.location.href = "/signin";
    }
});