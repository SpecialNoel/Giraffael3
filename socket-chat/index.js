// index.js

import express from "express";
import path from "node:path";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";

import { router as signInRouter } from "./server/routes/sign-in/sign-in-routes.js";
import { router as signUpRouter } from "./server/routes/sign-up/sign-up-routes.js";
import { router as dashboardRouter } from "./server/routes/dashboard/dashboard-routes.js";
import { router as roomsRouter } from "./server/routes/rooms/rooms-routes.js";

import { connectToDB } from "./server/utils/db-connector.js";
import { connectToRedis } from "./server/utils/redis-connector.js";

import { authenticateSocket } from "./server/socket/authenticate-socket.js";
import { registerJoinRoomHandler, 
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
io.use((socket, next) => {
    authenticateSocket(socket, next);
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
        await registerJoinRoomHandler(io, redis, socket, roomCode); 
    });
    socket.on("enterRoom", async (roomCode) => {
        // Register "enter room" socket events to the socket
        await registerEnterRoomHandler(socket, roomCode);
    });
    socket.on("exitRoom", async (roomCode) => {
        // Register "exit room" socket events to the socket
        await registerExitRoomHandler(socket, roomCode);
    });
    socket.on("chatMessage", async ({ msgContent, tmpId }, callback) => {
        // Register client disconnection socket event to the socket
        await registerChatHandler(socket, msgContent, tmpId, callback);
    });
    socket.on("disconnect", async () => {
        // Register chat message socket event to the socket
        await registerDisconnectHandler(redis, socket);
    });
})

// HTTP server listens on port 3000 (default localhost server for Express)
const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
    console.log(`Server is running at http://localhost:${serverPort}/signin\n`)
});
// ==================== Server Socket ==================== 

export { io };