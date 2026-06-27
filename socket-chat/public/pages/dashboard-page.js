// dashboard-page.js

import { createAuthenticatedSocket } from "../services/socket/socket-client.js";
import { enterRoomFromURL } from "../services/socket/room-services.js";
import { initializeDashboard } from "../services/dashboard/dashboard-initializer.js";
import { startSession } from "../services/socket/socket-events.js";

// Initialize the socket used to communicate with server, and adds event listeners to dashboard services
window.addEventListener("DOMContentLoaded", async () => {
    try {
        /* 
        * Create a socket and send the JWT token to server for authentication for socket events.
        * This step needs to be done first for the server to authenticate the client.
        * Once the client is authenticated (i.e. is trusted by server), server can
        *   use client information such as userObjectId and userId directly without the client
        *   send these information to server for each HTTP API endpoint operation and 
        *   other operations.
        * TLDR: token verification comes after user sign-in, but before every other 
        *       dashboard services.
        */
        const socket = await createAuthenticatedSocket();
        console.log("Created authenticated socket");

        // Fire the "enter room" event immediately after successful socket connection (and authentication) 
        enterRoomFromURL(socket);
        console.log("Entered room from url");

        // Handle user dashboard services (HTTP endpoints operations)
        initializeDashboard(socket);
        console.log("Initialized dashboard");

        // Start socket communication with server with the created socket
        startSession(socket);
        console.log("Started session");
    } catch (err) {
        alert("Failed to enter dashboard page. Return to sign-in page.");
        window.location.href = "/signin";
    }
});