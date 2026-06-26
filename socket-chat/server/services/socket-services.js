// socket-services.js

import { verifyToken } from "../utils/jwt-token-handler.js";
import { storeMessage } from "../db-services/message-services.js";

// Authenticate the user for operations handled with socket events
function authenticateForSocketEvents(socket, next) {
    try {
        // Receive JWT token from user (one time only)
        const token = socket.handshake.auth.token;

        // Verify the received token to ensure its validity
        const { userObjectId, userId } = verifyToken(token);
        // Apply received user info inside the token for later use
        socket.user = {
            userObjectId: userObjectId,
            userId: userId,
        };
        console.log(`Authenticated user ${userId} for socket events.`);

        // "next()" continues the connection by invocating "io.on("connection")"
        next();
    } catch (err) {
        console.log("Error in authenticating user");

        // "next(new Error())" rejects the connection
        next(new Error("Authentication failed"));
    }
}

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

// Notify every user who joined the room about the room deletion
function notifyUsersAboutRoomDeletion(io, roomCode) {
    console.log(io.sockets.adapter.rooms.get(roomCode));

    io.to(roomCode).emit("roomDeleted", {
        roomCode,
        msg: "This room has been deleted."
    });
}

// Handle user chat message event
// Note: use io.to() to include the sender; use socket.to() to exclude the sender
async function handleUserChatMessage(socket, roomCode, userObjectId, msgContent) {
    // Send the message to all connected users in the room (excluding the sender user)
    socket.to(roomCode).emit("chatMessageReceived", userObjectId, msgContent);

    // Store the message to MongoDB
    const message = await storeMessage(roomCode, userObjectId, msgContent, "text");

    // Print the message out on server side for debugging purpose
    console.log(`[${userObjectId}]: ${msgContent}`);
    return message;
}

export { authenticateForSocketEvents,
         getOnlineUsers,
         notifyUsersAboutRoomDeletion,
         handleUserChatMessage };