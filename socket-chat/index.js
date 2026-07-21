// index.js

import express from "express";
import path from "node:path";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";

import { router as signInRouter } from "./server/routes/auth/sign-in-routes.js";
import { router as signUpRouter } from "./server/routes/auth/sign-up-routes.js";
import { router as dashboardRouter } from "./server/routes/dashboard/dashboard-routes.js";
import { router as roomsRouter } from "./server/routes/rooms/rooms-routes.js";

import { getPublicIPAddress } from "./server/utils/ip-address-getter.js";
import { connectToDB } from "./server/utils/db-connector.js";
import { connectToRedis } from "./server/utils/redis-connector.js";

import { authenticateSocket } from "./server/socket/middleware/authenticate-socket.js";
import { registerJoinRoomHandler, 
         registerLeaveRoomHandler,
         registerEnterRoomHandler, 
         registerExitRoomHandler } from "./server/socket/handlers/room-handler.js";
import { registerDisconnectHandler } from "./server/socket/handlers/disconnect-handler.js";
import { registerChatHandler } from "./server/socket/handlers/chat-handler.js";


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

// Connect to Redis
const redis = await connectToRedis();

// Authenticate the user for operations handled with socket events before proceeding the connection
// Note that this comes after the client successfully signed in to the app
io.use(async (socket, next) => {
    await authenticateSocket(socket, next);
});

// SocketIO server handles the connection event
io.on("connection", async (socket) => {
    // Note that the server has already authenticated the user,
    // given the socket connection is established successfully between the user and server
    console.log(`User ${socket.user.userId} connected\n`);
    // Store the room code of the current visiting room to the connecting socket
    socket.currentRoomCode = null;

    socket.on("joinRoom", async (roomCode) => {
        // Register "join room" socket events to the socket
        await registerJoinRoomHandler(redis, socket, roomCode); 
    });
    socket.on("leaveRoom", async (roomCode) => {
        // Register "leave room" socket events to the socket
        await registerLeaveRoomHandler(socket, roomCode); 
    });
    socket.on("enterRoom", async (roomCode, conversationCursor) => {
        // Register "enter room" socket events to the socket
        await registerEnterRoomHandler(socket, roomCode, conversationCursor);
    });
    socket.on("exitRoom", async (roomCode) => {
        // Register "exit room" socket events to the socket
        await registerExitRoomHandler(socket, roomCode);
    });
    socket.on("chatMessage", async ({ content, tmpId }, callback) => {
        // Register chat message socket event to the socket
        await registerChatHandler(socket, tmpId, content, callback);
    });
    socket.on("disconnect", async () => {
        // Register client disconnection socket event to the socket
        await registerDisconnectHandler(redis, socket);
    });
})

// HTTP server listens on port 3000 (default localhost server for Express)
// const publicIP = await getPublicIPAddress();
let hostname = "localhost";
// hostname = publicIP
// hostname = "192.168.1.216";
const serverPort = process.env.PORT || 3000;
server.listen(serverPort, "0.0.0.0", () => {
    console.log(`Server is running at http://${hostname}:${serverPort}/signin\n`)
});
// ==================== Server Socket ==================== 

export { io };