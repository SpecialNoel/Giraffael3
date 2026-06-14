// services.js

import { verifyToken } from "./utils/jwt-token-handler.js";
import { User } from "./models/user-model.js";
import { storeMessage } from "./db-services/message-services.js";

// Authenticate the user for operations handled with http api endpoints
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Missing token",
            });
        }

        const token = authHeader.split(" ")[1];

        const { _id, userId } = verifyToken(token);

        req.user = {
            _id,
            userId,
        };

        next();
        console.log(`Authenticated user ${userId} for HTTP endpoints.`);
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}

// Get the user ids of online users in the room
async function getOnlineUsers(io, roomName) {
    const onlineUserSockets = await io.to(roomName).fetchSockets();
    const onlineUsers = onlineUserSockets.map(onlineSocket => onlineSocket.userId);
    return onlineUsers;
}

// Handle user connection events
async function handleUserConnection(io, roomName, socket) {
    // Join the user to the room
    socket.join(roomName);
    console.log(`User ${socket.id} connected`);
    console.log(`User ${socket.id} joined room ${roomName}`);

    // Broadcast a message to all users in the room upon user connection
    const onlineUsers = await getOnlineUsers(io, roomName);
    io.to(roomName).emit("user joined", onlineUsers);
    console.log(`Online users: ${onlineUsers}\n`);
}

// Handle user disconnection event
async function handleUserDisconnection(io, roomName, socket) {
    // Leave the user from the room
    socket.leave(roomName);
    console.log(`User ${socket.id} left room ${roomName}`);
    console.log(`User ${socket.id} disconnected`);

    // Broadcast a message to all users in the room upon user disconnection
    const onlineUsers = await getOnlineUsers(io, roomName);
    io.to(roomName).emit("user left", onlineUsers);
    console.log(`Online users: ${onlineUsers}\n`);
}

// Handle user chat message event
// Note: use io.to() to include the sender; use socket.to() to exclude the sender
async function handleUserChatMessage(socket, roomId, senderId, msg, callback) {
    const sender = await User.findOne({ userId: senderId });
    socket.userId = sender.userId;
    console.log(`User ${userId} [${socket.id}]: ${msg}`);

    // Send the message to all connected users in the room (excluding the sender user)
    socket.to(roomName).emit("chat message", senderId, msg);

    // Store the message to MongoDB
    await storeMessage(roomId, senderId, msg);

    // The callback function will be called to mark the acknowledgement from server on this event
    callback({
        status: "ok"
    });
}

export { authenticate,
         handleUserConnection, 
         handleUserDisconnection, 
         handleUserChatMessage };
