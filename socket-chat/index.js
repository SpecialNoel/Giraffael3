// index.js

// node index.js

import express from "express";
import path from "path";
import "./environment-loader.js";
// import { createAdapter } from "@socket.io/mongo-adapter";
import * as ServerServices from "./server-services.js"
import createUser from "./db-operations/user-generator.js"
import { connectToDB } from "./conn.js";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

// Initialize an Express application (a function handler)
const app = express();
// Expose the files inside the "static" folder to the browser when it requests them
app.use("/static", express.static(path.join(process.cwd(), "static")));

// Create an HTTP server on the application
const server = createServer(app);

// Create a SocketIO server on the HTTP server
const io = new Server(server)

// Connect to MongoDB
await connectToDB();

// Attach the adapter to the adapter collection (not the "messages" collection)
// The adapter collection lets Socket.IO work correctly across multiple server instances (scaling horizontally)
// It should be used in case of multiple Socket.IO servers (e.g. multiple EC2 instances)
// It stores ephemeral coordination events like room join/leave broadcasts, io.to(room).emit(), etc.
// These events are written by one server, read by other servers, and deleted automatically via TTL
// This collection is not for chat messages, user data, persistent logs, etc.
// Do this only if one process can no longer handle the workload properly
// Example for one process: 5k-20k concurrent connections, 10k-50k msg/s, and hundreds of rooms
// const adapterCollection = mongoose.connection.db.collection("socket.io-adapter-events");
// await adapterCollection.createIndex(
//     { createdAt: 1 },
//     { expireAfterSeconds: 3600 }
// );
// io.adapter(
//     createAdapter(adapterCollection, {
//         addCreatedAtField: true
//     })
// );

// Get the correct path to a directory inside server repository
const __dirname = dirname(fileURLToPath(import.meta.url));

// Handle home page function
app.get("/", (req, res) => {
    // Set the content of index.html as the home page
    res.sendFile(join(__dirname, "index.html"));
});

// Authenticate client credentials before proceeding the connection
io.use((socket, next) => {
    // Receive login credentials from client (one time only)
    const username = socket.handshake.auth.username;
    if (!username) {
        // Refuse the connection
        return next(new Error("invalid username"));
    }
    // Apply received username to the socket for later use
    socket.username = username;
    next();
});

// SocketIO server handles the connection event
io.on("connection", async (socket) => {
    console.log(`User ${socket.username} [${socket.id}] connected`);

    // Create an User model for this client
    const user = await createUser(socket.username);
    const userId = user.userId;

    // Handle the room selection event
    let roomCode = null;
    socket.on("create room", async (inputRoomName) => {
        roomCode = await ServerServices.handleClientCreateRoom(socket, userId, inputRoomName);
    });
    socket.on("join room", async (inputRoomCode) => {
        roomCode = await ServerServices.handleClientJoinRoom(socket, userId, inputRoomCode);
    });

    // // Handle the disconnection event
    // socket.on("disconnect", async () => {
    //     await ServerServices.handleClientDisconnection(io, roomId, socket);
    // });

    // // Handle the chat message event
    // socket.on("chat message", async (msg, callback) => {
    //     await ServerServices.handleClientChatMessage(socket, roomId, socket.id, msg, callback);
    // });
})

// HTTP server listens on port 3000 (default localhost server for Express)
const serverPort = process.env.PORT || "3000";
server.listen(serverPort, () => {
    console.log(`Server is running at http://localhost:${serverPort}\n`)
});
