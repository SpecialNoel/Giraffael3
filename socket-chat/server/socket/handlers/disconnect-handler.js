// disconnect-handler.js

// Handle the disconnection event
async function registerDisconnectHandler(redis, socket) {
    // Remove the user from Redis, and disconnect them from SocketIO, if they are currently in a room
    if (socket.activeRoomCode) {
        // Remove the user from the room in Redis
        const userId = socket.user.userId;
        console.log(`Removed user ${socket.user.userId} (SocketID: ${socket.id} from room in Redis`);

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