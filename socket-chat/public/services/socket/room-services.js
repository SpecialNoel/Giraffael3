// room-services.js

// Fire the "enter room" socket event to server
function enterRoom(socket, roomCode) {
    if (!roomCode) return;
    socket.emit("enterRoom", roomCode);
}

// Atomically fetch the room code from url bar, and fire the "enter room" socket event
function enterRoomFromURL(socket) {
    // Fetch the room code encoded in user's browser url bar
    const roomCode = new URLSearchParams(window.location.search).get("room");

    // Fire the "enter room" event to server
    enterRoom(socket, roomCode);
}

export { enterRoom, enterRoomFromURL };