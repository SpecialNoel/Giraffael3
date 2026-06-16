// index.js

import express from "express";
import path from "node:path";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";

import { router as signInRouter } from "./server/routes/sign-in-routes.js";
import { router as signUpRouter } from "./server/routes/sign-up-routes.js";
import { router as dashboardRouter } from "./server/routes/dashboard-routes.js";
import { router as roomsRouter } from "./server/routes/rooms-routes.js";

import { connectToDB } from "./server/utils/db-connector.js";
import * as Services from "./server/services.js";
import { verifyToken } from "./server/utils/jwt-token-handler.js";


// ==================== Express App ====================
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
app.use("/signin", signInRouter);
app.use("/signup", signUpRouter);
app.use("/dashboard", dashboardRouter);
app.use("/rooms", roomsRouter);
app.get("/", (req, res) => {
    // Set the default displaying page to be the sign-in page
    res.redirect("/signin");
});
// ==================== Express App ====================


// ==================== Server Socket ==================== 
// Create an HTTP server on the application
const server = createServer(app);

// Create a SocketIO server on the HTTP server
const io = new Server(server);

// Connect to MongoDB
await connectToDB();

// Authenticate the user for operations handled with socket events, 
//   before proceeding the connection
// Note that this comes after the client successfully signed in to the app
io.use((socket, next) => {
    try {
        // Receive JWT token from user (one time only)
        const token = socket.handshake.auth.token;

        // Verify the received token to ensure its validity
        const { _id, userId } = verifyToken(token);
        // Apply received user info inside the token for later use
        socket.user = {
            _id: _id,
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
});

// SocketIO server handles the connection event
io.on("connection", async (socket) => {
    // Notify the user that about authentication success
    socket.emit("auth:success");
    console.log(`User ${socket.user.userId} connected`);

    let currentRoomCode = null;

    // Handle user join room event
    socket.on("joinRoom", (roomCode) => {
        if (currentRoomCode) socket.leave(currentRoomCode);
        currentRoomCode = roomCode;
        socket.join(roomCode);
    });

    // Handle user enter room event
    socket.on("enterRoom", async (roomCode) => {
        if (currentRoomCode) socket.leave(currentRoomCode);
        currentRoomCode = roomCode;
        socket.join(roomCode);

        // Fetch members and message history of the room
        const members = [socket.user.userId]; // TODO: change this
        const messages = ["msg1", "msg2"] // TODO: change this

        // Send these information to the user
        socket.emit("userEntered", {
            members,
            messages
        });
    });

    // Handle user exit room event
    socket.on("exitRoom", () => {

    });

    // // Handle the disconnection event
    // socket.on("disconnect", async (roomId) => {
    //     await Services.handleClientDisconnection(io, roomId, socket);
    // });

    // // Handle the chat message event
    // socket.on("chatMessage", async (msg, roomId, callback) => {
    //     await Services.handleClientChatMessage(socket, roomId, socket.id, msg, callback);
    // });
})

// HTTP server listens on port 3000 (default localhost server for Express)
const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
    console.log(`Server is running at http://localhost:${serverPort}/signin\n`)
});
// ==================== Server Socket ==================== 

export { io };