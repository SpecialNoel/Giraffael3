// rooms-routes.js

import express from "express";
import path from "node:path";

import { pathToViewsDir } from "./route-helper.js";
import { findUser } from "../db-services/user-services.js";
import { createRoom, joinRoom, getRoomsInfo, findRoomByRoomCode } from "../db-services/room-services.js";
import { generateRoomCode } from "../utilities/room-code-generator.js";

const router = express.Router();

// Rooms API endpoints
router.post("/", async (req, res) => {
    // Retrieve the _id of the requesting user 
    const { userId } = req.body;

    // Retrieve the info about all rooms this user has joined
    const roomsInfo = await getRoomsInfo(userId);

    try {
        // Return the list of room info
        return res.status(200).json({
            success: true,
            message: "Fetch rooms success",
            roomsInfo
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});
router.post("/create", async (req, res) => {
    try {
        // Receive room name and creator info
        const { roomName, creatorId } = req.body;

        // Create the room
        const room = await createRoom(roomName, creatorId);

        // Retrieve necessary info about this new room
        const newRoomInfo = { roomName: room.roomName, roomCode: room.roomCode, members: room.members };

        // Create-room success
        return res.status(200).json({
            success: true,
            message: "Create room success",
            newRoomInfo: newRoomInfo
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});
router.post("/join", async (req, res) => {
    try {
        // Receive room code and user info
        const { roomCode, userId } = req.body;

        // Join the room
        const joinRoomResult = await joinRoom(roomCode, userId);
        
        // Handle join-room failure
        if (!joinRoomResult.success) {
            switch (joinRoomResult.reason) {
                case "ALREADY_IN_ROOM":
                    return res.status(409).json({
                        success: false,
                        error: "User already in room",
                    });
                case "ROOM_NOT_FOUND":
                    return res.status(404).json({
                        success: false,
                        error: "Room not found",
                    });
                default: 
                    return res.status(500).json({
                        success: false,
                        error: "Join room failure",
                    });
            }
        }

        // Retrieve necessary info about this room
        const room = joinRoomResult.room;
        const roomInfo = { roomName: room.roomName, roomCode: room.roomCode, members: room.members };

        // Join-room success
        return res.status(200).json({
            success: true,
            message: "Join room success",
            roomInfo: roomInfo
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
        const { roomCode, email } = req.body;

        // Check account existence in DB based on user email
        const user = await findUser(email);
        // Handle error where the account associated with the received email does not exist in DB
        if (!user) {
            console.log(`Email does not exist in DB: ${email}`);
            return res.status(401).json({ 
                error: "Invalid credentials"
            });
        }

        // Find the requesting room
        const room = await findRoomByRoomCode(roomCode);
        // Handle error where the requesting room does not exist in DB
        if (!room) {
            console.log(`Room does not exist in DB:`);
            return res.status(401).json({ 
                error: "Invalid request"
            });
        }

        // Enter-room success
        return res.status(200).json({
            success: true,
            message: "Enter room success",
            members: room.members
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});

export { router };