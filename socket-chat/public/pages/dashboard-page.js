// dashboard-page.js

import { initializeDashboard } from "../services/dashboard/dashboard-initializer.js";
import { startSession } from "../services/socket/socket-events-register.js";

// Initialize the socket used to communicate with server, and add event listeners for dashboard services
// to components on the Dashboard page
window.addEventListener("DOMContentLoaded", async () => {
    try {
        // Set up event listeners for user dashboard services (HTTP endpoints operations)
        await initializeDashboard();
        console.log("Initialized dashboard");

        // Start socket communication with server with the created socket by setting up the socket events
        startSession();
        console.log("Started session");
    } catch (err) {
        // If any error occurs, alert the error message to user and redirect them back to the sign in page
        alert("Failed to enter dashboard page. Return to sign-in page.");
        alert(err);
        console.error(err);
        window.location.href = "/signin";
    }
});