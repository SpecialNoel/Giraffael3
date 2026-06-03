// rooms-routes.js

import express from "express";
import path from "node:path";
import pathToViewsDir from "./route-helper.js"

import { findUser } from "../db-services/user-services.js";
import { createRoom, getRoomsInfo } from "../db-services/room-services.js";
import generateRoomCode from "../utilities/room-code-generator.js";

const router = express.Router();

// Rooms page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "rooms.html"));
});
router.post("/create", async (req, res) => {
    try {
        // Receive room name and creator info
        const { roomName, creatorId } = req.body;

        // Create the room
        const room = await createRoom(roomName, creatorId);

        // Retrieve necessary info about rooms the creator has joined
        const roomsInfo = await getRoomsInfo(creatorId);

        // Create-room success
        return res.status(200).json({
            success: true,
            message: "Create room success",
            roomCode: room.roomCode,
            roomsInfo: roomsInfo
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});
router.post("/enter", async (req, res) => {
    try {
        // Receive room id and user info
        const { roomId, email } = req.body;

        // Check account existence in DB based on user email
        const user = await findUser(email);

        // Handle error where the account associated with the received email does not exist in DB
        if (!user) {
            console.log(`Email does not exist in DB: ${email}`);
            return res.status(401).json({ 
                error: "Invalid credentials"
            });
        }

        // Enter-room success
        return res.status(200).json({
            success: true,
            message: "Enter room success"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});

export default router;