// index.js

// node index.js

import express from "express";
import path from "path";
import "./environment-loader.js";
// import { createAdapter } from "@socket.io/mongo-adapter";
import * as ServerServices from "./server-services.js"
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
const io = new Server(server, {
    // Server will temporarily store all events that are 
    // sent by the server, and will try to restore the state
    // of a client (rooms, and missed events) when it reconnects.
    // connectionStateRecovery: {
    //     // Server will store these info for 1 minute
    //     maxDisconnectionDuration: 1 * 60 * 1000, // 1 minute
    // }
})

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

// Get the correct path to a directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Handle home page function
app.get("/", (req, res) => {
    // Set the content of index.html as the home page
    res.sendFile(join(__dirname, "index.html"));
});

// SocketIO server handles the connection event
io.on("connection", async (socket) => {
    ServerServices.handleClientRecoverOrConnect(socket);

    // Join the client to the room
    const roomName = "Room 1";
    await ServerServices.handleClientConnection(io, roomName, socket);

    // Handle disconnection event
    socket.on("disconnect", async () => {
        await ServerServices.handleClientDisconnection(io, roomName, socket);
    });

    // Handle chat message event
    socket.on("chat message", async (username, msg, callback) => {
        await ServerServices.handleClientChatMessage(roomName, socket, username, msg, callback);
    });
})

// HTTP server listens on port 3000 (default localhost server for Express)
const serverPort = process.env.PORT || "3000";
server.listen(serverPort, () => {
    console.log(`Server is running at http://localhost:${serverPort}\n`)
});
