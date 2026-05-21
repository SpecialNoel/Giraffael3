// index.js

import express from "express";
import path from "node:path";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";

import signinRouter from "./routes/signin.js";
import signupRouter from "./routes/signup.js";
import dashboardRouter from "./routes/dashboard.js";
import chatroomRouter from "./routes/chatroom.js";

import createUser from "./server/db-operations/user-generator.js";
import connectToDB from "./server/utilities/conn.js";
import * as ServerServices from "./server/server-services.js";


// ========== Express App ========== 
// Initialize an Express application (a function handler)
const app = express();

/* 
   Expose the files inside the "public" folder to the browser when it requests them.
   Now "public" is treated as the root folder of the website files.
   This means that other files (like the html files) can directly call files inside "public",
   without adding "public" as part of the path. 
*/
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());

// Set up page routings
app.use("/signin", signinRouter);
app.use("/signup", signupRouter);
app.use("/dashboard", dashboardRouter);
app.use("/chatroom", chatroomRouter);
app.get("/", (req, res) => {
    // Set the default displaying page to be "signin" 
    res.redirect("/signin");
});
app.post("/signin", (req, res) => {
    // TODO: Add more authentication logics here
    // Currently: as long as the user typed something as their username, 
    //            they will be authenticated
    const { username } = req.body;
    if (!username) {
        console.log(`Recevied invalid redentials.`);
        return res.status(400).json({ error: "missing credentials" });
    }
    console.log(`Recevied credentials: ${username}`);
    return res.json({ username });
});
// ========== Express App ========== 


// ========== Server Socket ========== 
// Create an HTTP server on the application
const server = createServer(app);

// Create a SocketIO server on the HTTP server
const io = new Server(server)

// Connect to MongoDB
await connectToDB();

// Authenticate client credentials before proceeding the connection
io.use((socket, next) => {
    // Receive signin credentials from client (one time only)
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
const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
    console.log(`Server is running at http://localhost:${serverPort}/signin\n`)
});
// ========== Server Socket ========== 
