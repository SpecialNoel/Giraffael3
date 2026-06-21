// room-services.js

// Fire the "enter room" event to server
function enterRoom(socket, roomCode) {
    if (!roomCode) return;
    socket.emit("enterRoom", roomCode);
}

// Fetch the room code encoded in user's browser url bar
function getRoomCodeFromURL() {
    return new URLSearchParams(window.location.search).get("room");
}

// Atomically fetch the room code from url bar, and fire the "enter room" event
function enterRoomFromURL(socket) {
    const roomCode = getRoomCodeFromURL();
    enterRoom(socket, roomCode);
}

export { enterRoom, enterRoomFromURL };