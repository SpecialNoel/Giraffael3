// services.js

import { verifyToken } from "./utils/jwt-token-handler.js";
import { User } from "./models/user-model.js";
import { storeMessage } from "./db-services/message-services.js";
import { io } from "../index.js";

// Authenticate the user for operations handled with http api endpoints
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing token",
            });
        }

        const token = authHeader.split(" ")[1];

        const { _id, userId } = verifyToken(token);

        req.user = {
            _id,
            userId,
        };

        next();
        // console.log(`Authenticated user ${userId} for HTTP endpoints.`);
    } catch (err) {
        return res.status(401).json({
            error: "Invalid token",
        });
    }
}

// Notify every user who joined the room about the room deletion
function notifyUsersAboutRoomDeletion(roomCode) {
    console.log(io.sockets.adapter.rooms.get(roomCode));

    io.to(roomCode).emit("roomDeleted", {
        roomCode,
        msg: "This room has been deleted."
    });
}

// Get the user ids of online users in the room
async function getOnlineUsers(roomCode) {
    const onlineUserSockets = await io.to(roomCode).fetchSockets();
    const onlineUsers = onlineUserSockets.map(onlineSocket => onlineSocket.userId);
    return onlineUsers;
}

// Handle user disconnection event
async function handleUserDisconnection(io, roomCode, socket) {
    // Leave the user from the room
    socket.leave(roomCode);
    console.log(`User ${socket.id} left room ${roomCode}`);
    console.log(`User ${socket.id} disconnected`);

    // Broadcast a message to all users in the room upon user disconnection
    const onlineUsers = await getOnlineUsers(roomCode);
    io.to(roomCode).emit("userLeft", onlineUsers);
    console.log(`Online users: ${onlineUsers}\n`);
}

// Handle user chat message event
// Note: use io.to() to include the sender; use socket.to() to exclude the sender
async function handleUserChatMessage(socket, roomCode, _id, msgContent) {
    // Send the message to all connected users in the room (excluding the sender user)
    socket.to(roomCode).emit("chatMessageReceived", _id, msgContent);

    // Store the message to MongoDB
    const message = await storeMessage(roomCode, _id, msgContent, "text");

    // Print the message out on server side for debugging purpose
    console.log(`[${_id}]: ${msgContent}`);
    return message;
}

export { authenticate,
         notifyUsersAboutRoomDeletion,
         handleUserDisconnection, 
         handleUserChatMessage };
