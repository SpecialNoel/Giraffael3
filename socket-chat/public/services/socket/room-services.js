// room-services.js

// Fire the "enter room" socket event to server (used in room-navigation.js)
function enterRoom(socket, roomCode) {
    socket.emit("enterRoom", roomCode);
}

// Atomically fetch the room code from url bar, and fire the "enter room" socket event (used in room-navigation.js)
function enterRoomFromURL(socket) {
    // Fetch the room code encoded in user's browser url bar
    const roomCode = new URLSearchParams(window.location.search).get("room");

    // Fire the "enter room" event to server
    enterRoom(socket, roomCode);
}

export { enterRoom, enterRoomFromURL };