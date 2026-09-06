// room-broadcaster.js

// Notify every user who joined the room about the room deletion
function broadcastRoomDeleted(io, normalizedRoomCode) {
    const data = {
        roomCode: normalizedRoomCode,
        msg: "This room has been deleted."
    };
    io.to(normalizedRoomCode).emit("roomDeleted", data);
}

// Notify every user who left the room (including the leaving user) about a user leaving the room
function broadcastUserLeft(io, normalizedRoomCode, members) {
    const data = {
        roomCode: normalizedRoomCode,
        members,
        msg: "A user has left the room."
    };
    io.to(normalizedRoomCode).emit("userLeft", data);
}

// Notify every user who joined the room (excluding the joining user) about a user joining the room
function broadcastUserJoined(io, normalizedRoomCode, members) {
    const data = {
        roomCode: normalizedRoomCode,
        members,
        msg: "A user has joined the room."
    };
    io.to(normalizedRoomCode).emit("userJoined", data);
}

// Send the message to all connected users in the room (excluding the sender user)
function broadcastChatMessage(socket, normalizedRoomCode, tmpId, content) {
    const senderUsername = socket.user.username;
    const data = {
        tmpId, 
        roomCode: normalizedRoomCode,
        content, 
        senderUsername
    }
    socket.to(normalizedRoomCode).emit("chatMessageReceived", data);
}

export { 
    broadcastRoomDeleted,
    broadcastUserLeft,
    broadcastUserJoined,
    broadcastChatMessage 
};