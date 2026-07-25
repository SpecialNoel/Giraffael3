// room-broadcaster.js

// Notify every user who joined the room about the room deletion
function broadcastRoomDeleted(io, roomCode) {
    const data = {
        roomCode,
        msg: "This room has been deleted."
    };
    io.to(roomCode).emit("roomDeleted", data);
}

// Notify every user who joined the room (excluding the leaving user) about an user leaving the room
function broadcastUserLeft(socket, roomCode, memberList) {
    const data = {
        roomCode,
        memberList,
        msg: "An user has left the room."
    };
    socket.to(roomCode).emit("userLeft", data);
}

// Notify every user who joined the room (excluding the joining user) about an user joining the room
function broadcastUserJoined(socket, roomCode, memberList) {
    const data = {
        roomCode,
        memberList,
        msg: "An user has joined the room."
    };
    socket.to(roomCode).emit("userJoined", data);
}

// Send the message to all connected users in the room (excluding the sender user)
function broadcastChatMessage(socket, roomCode, tmpId, content) {
    const senderUsername = socket.user.username;
    const data = {
        tmpId, 
        content, 
        senderUsername
    }
    socket.to(roomCode).emit("chatMessageReceived", data);
}

export { broadcastRoomDeleted,
         broadcastUserLeft,
         broadcastUserJoined,
         broadcastChatMessage };