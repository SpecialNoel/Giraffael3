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

// Authenticate user credentials (JWT token) before proceeding the connection
io.use((socket, next) => {
    // Receive JWT token from user (one time only)
    const token = socket.handshake.auth.token;

    try {
        // Verify the received token to ensure its validity
        const userId = verifyToken(token);
        // Apply received userId inside the token for later use
        socket.userId = userId;
        // next() continues the connection
        next();
        console.log(`Authenticated user ${userId}`);
    } catch (err) {
        // next(new Error()) rejects the connection
        next(new Error("Authentication failed"));
        console.log("Error in authenticating user");
    }
});

// SocketIO server handles the connection event
io.on("connection", async (socket) => {
    console.log(`User ${socket.userId} connected`);

    // Handle the disconnection event
    socket.on("disconnect", async () => {
        await Services.handleClientDisconnection(io, roomId, socket);
    });

    // Handle the chat message event
    socket.on("chat message", async (msg, callback) => {
        await Services.handleClientChatMessage(socket, roomId, socket.id, msg, callback);
    });
})

// HTTP server listens on port 3000 (default localhost server for Express)
const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
    console.log(`Server is running at http://localhost:${serverPort}/signin\n`)
});
// ==================== Server Socket ==================== 
