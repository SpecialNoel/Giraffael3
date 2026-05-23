// index.js

import express from "express";
import path from "node:path";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";

import signinRouter from "./server/routes/signin-router.js";
import signupRouter from "./server/routes/signup-router.js";
import dashboardRouter from "./server/routes/dashboard-router.js";
import chatroomListRouter from "./server/routes/chatroom-list-router.js";

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
app.use("/chatroom-list", chatroomListRouter);
app.get("/", (req, res) => {
    // Set the default displaying page to be the sign-in page
    res.redirect("/signin");
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
    // Receive sign-in credentials from client (one time only)
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
})

// HTTP server listens on port 3000 (default localhost server for Express)
const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
    console.log(`Server is running at http://localhost:${serverPort}/signin\n`)
});
// ========== Server Socket ========== 
