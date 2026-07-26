// dashboard-initializer.js

import { setupRoomEvents } from "./room-controller.js";
import { initializeHistoryNavigation } from "./room-navigation.js";
import { loadRooms } from "./room-loader.js";

// Set up event listeners for user dashboard services (HTTP endpoints operations)
function initializeDashboard(socket) {
    // Set up the room logics (via http endpoints, socket events, or both)
    setupRoomEvents(socket);
    // Set up the application so that it navigates when the user uses the browser's Back and Forward buttons
    initializeHistoryNavigation(socket);
    // Fetch rooms information from server, and render them to Dashboard page UI
    loadRooms();
}

export { initializeDashboard };