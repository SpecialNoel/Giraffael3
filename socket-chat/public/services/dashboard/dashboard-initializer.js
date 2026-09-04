// dashboard-initializer.js

import { setUpRoomEvents } from "./room-controller.js";
import { initializeHistoryNavigation } from "./room-navigation.js";
import { loadRooms } from "./room-view.js";
import { setUpRoomBackBtn } from "./room-back-btn-handler.js";
import { setUpConversationScroller } from "../../services/dashboard/conversation/scroller-setter.js";

// Set up event listeners for user dashboard services (HTTP endpoints operations)
async function initializeDashboard(socket) {
    // Set up the room logics (via http endpoints, socket events, or both)
    setUpRoomEvents(socket);
    // Set up the application so that it navigates when the user uses the browser's Back and Forward buttons
    initializeHistoryNavigation(socket);
    // Fetch rooms information from server, and render them to Dashboard page UI
    loadRooms();
    // Set up the room-back button
    setUpRoomBackBtn();
    // Set up scroller in the conversation element to fetch and load older messages upon user scrolling upwards
    await setUpConversationScroller();
}

export { initializeDashboard };