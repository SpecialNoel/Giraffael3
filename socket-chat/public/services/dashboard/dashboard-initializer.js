// dashboard-initializer.js

function initializeDashboard(socket) {
    setupRoomEvents(socket);
    setupNavigation(socket);
    loadRooms();
}

export { initializeDashboard };