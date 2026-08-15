// rooms-routes.js

import express from "express";
import path from "node:path";

import { authenticateHTTP } from "../../middleware/authenticate-http.js";
import { handleFetchRoomsInfo } from "./handlers/fetch-rooms-info-handler.js";
import { handleFetchRoomInfo } from "./handlers/fetch-room-info-handler.js";
import { handleFetchOlderMessages } from "./handlers/fetch-older-messages-handler.js";
import { handleCreateRoom } from "./handlers/create-room-handler.js";
import { handleDeleteRoom } from "./handlers/delete-room-handler.js";
import { handleJoinRoom } from "./handlers/join-room-handler.js";
import { handleLeaveRoom } from "./handlers/leave-room-handler.js";
import { io, redis } from "../../../index.js";

const router = express.Router();

// Rooms API endpoints
// Note that only "CreateRoom", "DeleteRoom", "JoinRoom", and "LeaveRoom" use HTTP API endpoints
// "EnterRoom" and "ExitRoom" uses socket events only
router.get("/", authenticateHTTP, async (req, res) => {
    return await handleFetchRoomsInfo(req, res);
});
router.get("/:roomCode/room-info", authenticateHTTP, async (req, res) => {
    return await handleFetchRoomInfo(req, res);
});
router.get("/:roomCode/messages", authenticateHTTP, async (req, res) => {
    return await handleFetchOlderMessages(req, res);
});
router.post("/create", authenticateHTTP, async (req, res) => {
    return await handleCreateRoom(req, res, io);
});
router.post("/delete", authenticateHTTP, async (req, res) => {
    return await handleDeleteRoom(req, res, io);
});
router.post("/join", authenticateHTTP, async (req, res) => {
    return await handleJoinRoom(req, res, redis, io);
});
router.post("/leave", authenticateHTTP, async (req, res) => {
    return await handleLeaveRoom(req, res, io);
});

export { router };