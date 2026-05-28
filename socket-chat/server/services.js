// services.js

import User from "./models/user-model.js";
import Room from "./models/room-model.js";
import { storeMessage } from "./db-services/message-services.js";
import { findRoomCodes, createRoom, addUserToRoom } from "./db-services/room-services.js"

// Get the usernames of online users in the room
async function getOnlineUsers(io, roomName) {
    const onlineUserSockets = await io.to(roomName).fetchSockets();
    const onlineUsers = onlineUserSockets.map(onlineSocket => onlineSocket.username);
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
    console.log(`Online users: ${onlineUsers}\n`)
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
    console.log(`Online users: ${onlineUsers}\n`)
}

// Handle user create room request
async function handleUserCreateRoom(socket, userId, inputRoomName) {
    console.log(`Received room name: ${inputRoomName}`);

    // Create a new room with the given room name
    const generatedRoom = await createRoom(inputRoomName);
    const roomCode = generatedRoom.roomCode;
    const roomName = generatedRoom.roomName;

    // Join the user to this new room
    await addUserToRoom(roomCode, userId);

    // Send the room name and room code to the user
    socket.emit("room-created", roomCode, roomName);

    // Return the room code
    return roomCode;
}

// Handle user join room request
async function handleUserJoinRoom(socket, userId, inputRoomCode) {
    // Check the room existence of the given room code
    const roomCodesInDB = await findRoomCodes();

    if (!roomCodesInDB.has(inputRoomCode)) {
        console.log("Invalid room code: room code not exist")
        return null;
    }

    // Find the room instance
    const room = await Room.findOne({ roomCode: inputRoomCode });
    const roomCode = room.roomCode;
    const roomName = room.roomName;

    // Join the user to this new room
    await addUserToRoom(roomCode, userId);

    // Send the room name and room code to the user
    socket.emit("room-joined", roomCode, roomName);

    // Return the room code
    return roomCode;
}

// Handle user chat message event
// Note: use io.to() to include the sender; use socket.to() to exclude the sender
async function handleUserChatMessage(socket, roomId, senderId, msg, callback) {
    const sender = await User.findOne({ userId: senderId });
    socket.username = sender.username;
    console.log(`User ${username} [${socket.id}]: ${msg}`);

    // Send the message to all connected users in the room (excluding the sender user)
    socket.to(roomName).emit("chat message", username, msg);

    // Store the message to MongoDB
    await storeMessage(roomId, senderId, msg);

    // The callback function will be called to mark the acknowledgement from server on this event
    callback({
        status: "ok"
    });
}

export { handleUserConnection, 
         handleUserDisconnection, 
         handleUserCreateRoom,
         handleUserJoinRoom,
         handleUserChatMessage }
