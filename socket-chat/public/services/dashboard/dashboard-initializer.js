// dashboard-initializer.js

import { setupNavigation } from "./room-navigation.js";
import { setupRoomEvents } from "./room-controller.js";
import { loadRooms } from "./room-loader.js";

function initializeDashboard(socket) {
    setupRoomEvents(socket);
    setupNavigation(socket);
    loadRooms();
}

export { initializeDashboard };