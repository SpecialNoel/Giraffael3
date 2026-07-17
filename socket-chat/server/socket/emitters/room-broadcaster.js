// room-broadcaster.js

// Notify every user who joined the room about the room deletion
function broadcastRoomDeleted(io, roomCode) {
    io.to(roomCode).emit("roomDeleted", {
        roomCode,
        msg: "This room has been deleted."
    });
}

// Notify every user who joined the room (excluding the leaving user) about an user leaving the room
function broadcastUserLeft(socket, roomCode, memberList) {
    socket.to(roomCode).emit("userLeft", {
        roomCode,
        memberList,
        msg: "An user has left the room."
    });
}

// Notify every user who joined the room (excluding the joining user) about an user joining the room
function broadcastUserJoined(socket, roomCode, memberList) {
    socket.to(roomCode).emit("userJoined", {
        roomCode,
        memberList,
        msg: "An user has joined the room."
    });
}

// Send the message to all connected users in the room (excluding the sender user)
function broadcastChatMessage(socket, roomCode, tmpId, content) {
    const senderUsername = socket.user.username;
    socket.to(roomCode).emit("chatMessageReceived", tmpId, content, senderUsername);
}

export { broadcastRoomDeleted,
         broadcastUserLeft,
         broadcastUserJoined,
         broadcastChatMessage };