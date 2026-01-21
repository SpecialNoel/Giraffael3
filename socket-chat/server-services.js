// server-services.js
import storeMessage from "./db-operations/message-saver.js";

// Check whether this client socket connection is either "recovered" or "newly connected"
function handleClientRecoverOrConnect(socket) {
    if (socket.recovered) {
        // This will be proc'ed only if the client socket disconnects
        // unexpectedly (i.e. not manual disconnection with socket.disconnect())
        console.log(`User ${socket.id} recovered`);
        console.log(socket.data);
    } else {
        console.log(`User ${socket.id} connected`);
    }
}

// Get the usernames of online users in the room
async function getOnlineUsersInRoom(io, roomName) {
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
    const onlineUsers = await getOnlineUsersInRoom(io, roomName);
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
    const onlineUsers = await getOnlineUsersInRoom(io, roomName);
    io.to(roomName).emit("user left", onlineUsers);
    console.log(`Online users: ${onlineUsers}\n`)
}

// Handle client chat message event
async function handleClientChatMessage(roomName, socket, username, msg, callback) {
    socket.username = username;
    console.log(`User ${username} [${socket.id}]: ${msg}`);
    
    // Send the message to all connected clients (including the sender client)
    // io.emit("chat message", socket.id, msg);

    // Send the message to all connected clients in the room (excluding the sender client)
    socket.to(roomName).emit("chat message", username, msg);

    // Broadcast the message to all connected clients in the room
    //io.to(roomName).emit("chat message", socket.id, msg)

    // Broadcast the message to all connected clients except those in the room
    //io.except(roomName).emit("chat message", socket.id, msg)

    // Store the message to MongoDB
    const savedMessage = await storeMessage(socket.id, username, msg);
    // console.log(getMessageWithNYTimezone(savedMessage));

    // The callback function will be called to mark server's acknowledgement on this event
    callback({
        status: "ok"
    });
}

export { handleClientRecoverOrConnect, 
         handleClientConnection, 
         handleClientDisconnection, 
         handleClientChatMessage }
