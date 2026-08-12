// dashboard-page.js

import { createAuthenticatedSocket } from "../services/socket/socket-client.js";
import { initializeDashboard } from "../services/dashboard/dashboard-initializer.js";
import { startSession } from "../services/socket/socket-events.js";

function requireAuthentication() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please sign in to access this page.");
        window.location.href = "/signin";
        return false;
    }
    return true;
}

// Initialize the socket used to communicate with server, and add event listeners for dashboard services
// to components on the Dashboard page
window.addEventListener("DOMContentLoaded", async () => {
    try {
        // Preventing the user from navigating to the Dashboard page directly without validating their credentials
        // by modifying the url.
        // Note that this only prevents the first-time user from misbehaving, since it depends on the existence of "token"
        // TODO: Update this part with page authentication for better protection
        if (!requireAuthentication()) return;

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

        // Set up event listeners for user dashboard services (HTTP endpoints operations)
        await initializeDashboard(socket);
        console.log("Initialized dashboard");

        // Start socket communication with server with the created socket by setting up the socket events
        startSession(socket);
        console.log("Started session");
    } catch (err) {
        // If any error occurs, alert the error message to user and redirect them back to the sign in page
        alert("Failed to enter dashboard page. Return to sign-in page.");
        console.error(err);
        window.location.href = "/signin";
    }
});