// room-services.js

// Fire the "enter room" socket event to server (used in room-navigation.js)
function enterRoom(socket, roomCode, conversationCursor) {
    socket.emit("enterRoom", roomCode, conversationCursor);
}

// Atomically fetch the room code from url bar, and fire the "enter room" socket event (used in room-navigation.js)
function enterRoomFromURL(socket, conversationCursors) {
    // Fetch the room code encoded in user's browser url bar
    const roomCode = new URLSearchParams(window.location.search).get("room");

    // Initialize the conversation cursor for this room, if this user has never retrieved message yet
    // Otherwise, fetch the stored cursor
    let conversationCursor = null;
    if (conversationCursors.has(roomCode)) conversationCursor = conversationCursors.get(roomCode);

    // Fire the "enter room" event to server
    enterRoom(socket, roomCode, conversationCursor);
}

export { enterRoom, enterRoomFromURL };