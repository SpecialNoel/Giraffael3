// room-services.js

// Fire the "enter room" socket event to server (used in room-navigation.js)
function enterRoom(socket, roomCode, cursor) {
    socket.emit("enterRoom", roomCode, cursor);
}

// Atomically fetch the room code from url bar, and fire the "enter room" socket event (used in room-navigation.js)
function enterRoomFromURL(socket, roomPaginationStates) {
    // Fetch the room code encoded in user's browser url bar
    const roomCode = new URLSearchParams(window.location.search).get("room");

    // Initialize the conversation cursor for this room, if this user has never retrieved message yet
    // Otherwise, fetch the stored cursor
    const state = roomPaginationStates.get(roomCode) ?? null;
    const cursor = state ? state.cursor : null;

    // Fire the "enter room" event to server
    enterRoom(socket, roomCode, cursor);
}

export { enterRoom, enterRoomFromURL };