// notify-user.js

// Notify every user who joined the room about the room deletion
function notifyUsersAboutRoomDeletion(io, roomCode) {
    io.to(roomCode).emit("roomDeleted", {
        roomCode,
        msg: "This room has been deleted."
    });
}

// Send the message to all connected users in the room (excluding the sender user)
function notifyRoomAboutMessage(socket, roomCode, tmpId, content) {
    socket.to(roomCode).emit("chatMessageReceived", tmpId, content);
}

export { notifyUsersAboutRoomDeletion,
         notifyRoomAboutMessage };