// server-services.js

import storeMessage from "./db-operations/message-saver.js";
import User from "./models/user-model.js";
import Room from "./models/room-model.js";
import createRoom from "./db-operations/room-generator.js";
import retrieveAllRoomCodes from "./db-operations/room-codes-retriever.js"
import joinClientToRoom from "./db-operations/client-join-room-handler.js"

// Get the usernames of online users in the room
async function getOnlineUsers(io, roomName) {
    const onlineUserSockets = await io.to(roomName).fetchSockets();
    const onlineUsers = onlineUserSockets.map(onlineSocket => onlineSocket.username);
    return onlineUsers;
}

// Handle client connection events
async function handleClientConnection(io, roomName, socket) {
    // Join the client to the room
    socket.join(roomName);
    console.log(`User ${socket.id} connected`);
    console.log(`User ${socket.id} joined room ${roomName}`);

    // Broadcast a message to all clients in the room upon client connection
    const onlineUsers = await getOnlineUsers(io, roomName);
    io.to(roomName).emit("user joined", onlineUsers);
    console.log(`Online users: ${onlineUsers}\n`)
}

// Handle client disconnection event
async function handleClientDisconnection(io, roomName, socket) {
    // Leave the client from the room
    socket.leave(roomName);
    console.log(`User ${socket.id} left room ${roomName}`);
    console.log(`User ${socket.id} disconnected`);

    // Broadcast a message to all clients in the room upon client disconnection
    const onlineUsers = await getOnlineUsers(io, roomName);
    io.to(roomName).emit("user left", onlineUsers);
    console.log(`Online users: ${onlineUsers}\n`)
}

// Handle client create room request
async function handleClientCreateRoom(socket, userId, inputRoomName) {
    console.log(`Received room name: ${inputRoomName}`);

    // Create a new room with the given room name
    const generatedRoom = await createRoom(inputRoomName);
    const roomCode = generatedRoom.roomCode;
    const roomName = generatedRoom.roomName;

    // Join the client to this new room
    await joinClientToRoom(roomCode, userId);

    // Send the room name and room code to the client
    socket.emit("room-created", roomCode, roomName);

    // Return the room code
    return roomCode;
}

// Handle client join room request
async function handleClientJoinRoom(socket, userId, inputRoomCode) {
    // Check the room existence of the given room code
    const roomCodesInDB = await retrieveAllRoomCodes();

    if (!roomCodesInDB.has(inputRoomCode)) {
        console.log("Invalid room code: room code not exist")
        return null;
    }

    // Find the room instance
    const room = await Room.findOne({ roomCode: inputRoomCode });
    const roomCode = room.roomCode;
    const roomName = room.roomName;

    // Join the client to this new room
    await joinClientToRoom(roomCode, userId);

    // Send the room name and room code to the client
    socket.emit("room-joined", roomCode, roomName);

    // Return the room code
    return roomCode;
}

// Handle client chat message event
// Note: use io.to() to include the sender; use socket.to() to exclude the sender
async function handleClientChatMessage(socket, roomId, senderId, msg, callback) {
    const sender = await User.findOne({ userId: senderId });
    socket.username = sender.username;
    console.log(`User ${username} [${socket.id}]: ${msg}`);

    // Send the message to all connected clients in the room (excluding the sender client)
    socket.to(roomName).emit("chat message", username, msg);

    // Store the message to MongoDB
    await storeMessage(roomId, senderId, msg);

    // The callback function will be called to mark the acknowledgement from server on this event
    callback({
        status: "ok"
    });
}

export { handleClientConnection, 
         handleClientDisconnection, 
         handleClientCreateRoom,
         handleClientJoinRoom,
         handleClientChatMessage }
