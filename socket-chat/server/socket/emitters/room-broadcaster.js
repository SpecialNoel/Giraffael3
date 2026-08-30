// room-broadcaster.js

// Notify every user who joined the room about the room deletion
function broadcastRoomDeleted(io, roomCode) {
    const data = {
        roomCode,
        msg: "This room has been deleted."
    };
    io.to(roomCode).emit("roomDeleted", data);
}

// Notify every user who left the room (including the leaving user) about a user leaving the room
function broadcastUserLeft(io, roomCode, members) {
    const data = {
        roomCode,
        members,
        msg: "A user has left the room."
    };
    io.to(roomCode).emit("userLeft", data);
}

// Notify every user who joined the room (excluding the joining user) about a user joining the room
function broadcastUserJoined(io, roomCode, members) {
    const data = {
        roomCode,
        members,
        msg: "A user has joined the room."
    };
    io.to(roomCode).emit("userJoined", data);
}

// Send the message to all connected users in the room (excluding the sender user)
function broadcastChatMessage(socket, roomCode, tmpId, content) {
    const senderUsername = socket.user.username;
    const data = {
        tmpId, 
        roomCode,
        content, 
        senderUsername
    }
    socket.to(roomCode).emit("chatMessageReceived", data);
}

export { 
    broadcastRoomDeleted,
    broadcastUserLeft,
    broadcastUserJoined,
    broadcastChatMessage 
};