// get-online-users.js

// Fetch all online users inside a room via Socket.IO
async function getOnlineUsers(io, roomCode) {
    try {
        // Fetch all sockets connected to server in this room
        // This counts all sockets that server connected via "socket.join(roomCode)"
        // Note that multiple sockets from a same user will be included here
        const sockets = await io.in(roomCode).fetchSockets();

        // Convert the fetched sockets to unique, corresponding public user ids
        const onlineUsers = [...new Set(
            sockets.map(socket => socket.user.userId)
        )];
        return onlineUsers;
    } catch (err) {
        console.error("Failed to get online users inside room in Redis:", err);
    };
}

export { getOnlineUsers };