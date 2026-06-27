// notify-user.js

// Notify every user who joined the room about the room deletion
function notifyUsersAboutRoomDeletion(io, roomCode) {
    console.log(io.sockets.adapter.rooms.get(roomCode));

    io.to(roomCode).emit("roomDeleted", {
        roomCode,
        msg: "This room has been deleted."
    });
}

// Send the message to all connected users in the room (excluding the sender user)
function notifyRoomAboutMessage(socket, roomCode, userObjectId, msgContent) {
    socket.to(roomCode).emit("chatMessageReceived", userObjectId, msgContent);
}

export { notifyUsersAboutRoomDeletion,
         notifyRoomAboutMessage };