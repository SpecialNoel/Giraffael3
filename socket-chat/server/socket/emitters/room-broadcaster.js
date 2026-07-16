// room-broadcaster.js

// Notify every user who joined the room about the room deletion
function broadcastRoomDeleted(io, roomCode) {
    io.to(roomCode).emit("roomDeleted", {
        roomCode,
        msg: "This room has been deleted."
    });
}

// Notify every user who joined the room about an user leaving the room
function broadcastUserLeft(io, roomCode, memberList) {
    io.to(roomCode).emit("userLeft", {
        roomCode,
        memberList,
        msg: "An user has left the room."
    });
}

// Send the message to all connected users in the room (excluding the sender user)
function broadcastChatMessage(socket, roomCode, tmpId, content) {
    const senderUsername = socket.user.username;
    socket.to(roomCode).emit("chatMessageReceived", tmpId, content, senderUsername);
}

export { broadcastRoomDeleted,
         broadcastUserLeft,
         broadcastChatMessage };