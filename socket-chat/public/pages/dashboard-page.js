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

        // A mapping between room codes and their conversation cursors to keep track of the next batch of messages to fetch
        const conversationCursors = new Map();

        // Set up event listeners for user dashboard services (HTTP endpoints operations)
        initializeDashboard(socket, conversationCursors);
        console.log("Initialized dashboard");

        // Set up scroller in the conversation element to fetch and display more older messages upon user scrolling upwards
        await setupConversationScroller(conversationCursors);

        // Start socket communication with server with the created socket by setting up the socket events
        startSession(socket, conversationCursors);
        console.log("Started session");
    } catch (err) {
        // If any error occurs, alert the error message to user and redirect them back to the sign in page
        alert("Failed to enter dashboard page. Return to sign-in page.");
        window.location.href = "/signin";
    }
});