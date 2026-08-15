// disconnect-handler.js

// Handle the disconnection event
async function registerDisconnectHandler(socket) {
    // Disconnect them from SocketIO, if they are currently in a room
    if (socket.activeRoomCode) {
        // Disconnect the user from SocketIO
        socket.leave(socket.activeRoomCode);
        console.log(`User ${socket.user.userId} (SocketID: ${socket.id}) left room ${socket.activeRoomCode}`);
        socket.activeRoomCode = null;
        console.log(`User ${socket.user.userId} (SocketID: ${socket.id}) disconnected\n`);
    } else {
        console.log(`User ${socket.user.userId} (SocketID: ${socket.id}) disconnected without being in a room\n`);
    }
}

export { registerDisconnectHandler };