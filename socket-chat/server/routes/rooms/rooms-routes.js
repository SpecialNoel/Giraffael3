// rooms-routes.js

import express from "express";
import path from "node:path";

import { authenticateHTTP } from "../../middleware/authenticate-http.js";
import { handleFetchRoomInfo } from "./fetch-room-info-handler.js";
import { handleCreateRoom } from "./create-room-handler.js";
import { handleDeleteRoom } from "./delete-room-handler.js";
import { handleJoinRoom } from "./join-room-handler.js";
import { handleLeaveRoom } from "./leave-room-handler.js";
import { handleEnterRoom } from "./enter-room-handler.js";
import { io } from "../../../index.js";

const router = express.Router();

// Rooms API endpoints
router.get("/", authenticateHTTP, async (req, res) => {
    return await handleFetchRoomInfo(req, res);
});
router.post("/create", authenticateHTTP, async (req, res) => {
    return await handleCreateRoom(req, res);
});
router.post("/delete", authenticateHTTP, async (req, res) => {
    return await handleDeleteRoom(req, res, io);
});
router.post("/join", authenticateHTTP, async (req, res) => {
    return await handleJoinRoom(req, res);
});
router.post("/leave", authenticateHTTP, async (req, res) => {
    return await handleLeaveRoom(req, res);
});
router.post("/enter", authenticateHTTP, async (req, res) => {
    return await handleEnterRoom(req, res);
});

export { router };