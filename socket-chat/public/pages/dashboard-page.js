// dashboard-page.js

import { handleDashboard, setupRoomsContainerRefresher } from "../services/dashboard-service.js";
import { createAuthenticatedSocket, startSession } from "../services/socket-service.js";
import { enterRoomFromURL } from "../services/room-service.js";

// Initialize the socket used to communicate with server, and adds event listeners to dashboard services
window.addEventListener("DOMContentLoaded", async () => {
    try {
        /* 
        * Create a socket and send the JWT token to server for authentication for socket events.
        * This step needs to be done first for the server to authenticate the client.
        * Once the client is authenticated (i.e. is trusted by server), server can
        *   use client information such as _id and userId directly without the client
        *   send these information to server for each HTTP API endpoint operation and 
        *   other operations.
        * TLDR: token verification comes after user sign-in, but before every other 
        *       dashboard services.
        */
        const socket = await createAuthenticatedSocket();

        // Fire the "enter room" event immediately after successful socket connection (and authentication) 
        enterRoomFromURL(socket);

        // Handle user dashboard services (HTTP endpoints operations)
        handleDashboard(socket);

        // Refresh the rooms container upon user refreshing the dashboard page (HTTP endpoints operations)
        setupRoomsContainerRefresher();

        // Start socket communication with server with the created socket
        startSession(socket);
    } catch (err) {
        alert("Failed to enter dashboard page. Return to sign-in page.");
        window.location.href = "/signin";
    }
});