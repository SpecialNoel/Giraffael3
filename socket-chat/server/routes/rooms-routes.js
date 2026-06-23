// rooms-routes.js

import express from "express";
import path from "node:path";

import { pathToViewsDir } from "./route-helper.js";
import { findUserByEmail } from "../db-services/user-services.js";
import * as RoomServices from "../db-services/room-services.js";
import { authenticateForHTTPEndpoints } from "../services/http-endpoint-services.js";
import { notifyUsersAboutRoomDeletion } from "../services/socket-services.js";
import { io } from "../../index.js";

const router = express.Router();

// Rooms API endpoints
router.get("/", authenticateForHTTPEndpoints, async (req, res) => {
    try {
        // Retrieve _id of the requesting user 
        const _id = req.user._id;

        // Retrieve the info about all existing rooms this user has joined
        const roomsInfo = await RoomServices.getRoomsInfo(_id);
        
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

router.post("/create", authenticateForHTTPEndpoints, async (req, res) => {
    try {
        // Receive room name and creator info
        const { roomName } = req.body;
        const _id = req.user._id;

        // Create the room
        const room = await RoomServices.createRoom(roomName, _id);

        // Retrieve necessary info about this new room
        const roomInfo = { roomName: room.roomName, 
                           roomCode: room.roomCode, 
                           creator:  room.creator, 
                           members:  room.members };

        // Create-room success
        return res.status(200).json({
            success: true,
            message: "Create room success",
            roomInfo: roomInfo
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});

router.post("/delete", authenticateForHTTPEndpoints, async (req, res) => {
    try {
        // Receive room name and user info
        const { roomCode } = req.body;
        const _id = req.user._id;

        // Handle case where received _id does not match the room's creator id
        if (!RoomServices.isUserTheCreatorOfRoom(roomCode, _id)) {
            return res.status(401).json({
                success: false,
                error: "Delete room failure",
            });
        }

        // Broadcast the room deletion to all users who joined this room via socket events
        notifyUsersAboutRoomDeletion(io, roomCode);
        console.log(`Notified all users in room ${roomCode} about room deletion`);

        // Delete the room from the database
        const deletedAt = await RoomServices.deleteRoom(roomCode);

        // Delete-room success
        return res.status(200).json({
            success: true,
            message: "Delete room success",
            deletedAt: deletedAt
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});

router.post("/join", authenticateForHTTPEndpoints, async (req, res) => {
    try {
        // Receive room code and user info
        const { roomCode } = req.body;
        const _id = req.user._id;

        // Join the room
        const joinRoomResult = await RoomServices.joinRoom(roomCode, _id);
        
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
        const roomInfo = { roomName: room.roomName, 
                           roomCode: room.roomCode, 
                           creator:  room.creator, 
                           members:  room.members };
        const isCreatorOfRoom = _id.toString() === room.creator.toString();
        // Join-room success
        return res.status(200).json({
            success: true,
            message: "Join room success",
            roomInfo: roomInfo,
            isCreatorOfRoom: isCreatorOfRoom
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});

router.post("/leave", authenticateForHTTPEndpoints, async (req, res) => {
    try {
        // Receive room code and user info
        const { roomCode } = req.body;
        const _id = req.user._id;

        // Join the room
        const leaveRoomResult = await RoomServices.leaveRoom(roomCode, _id);
        
        // Handle join-room failure
        if (!leaveRoomResult.success) {
            switch (leaveRoomResult.reason) {
                case "NOT_IN_ROOM":
                    return res.status(400).json({
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
                        error: "Leave room failure",
                    });
            }
        }

        // Leave-room success
        return res.status(200).json({
            success: true,
            message: "Leave room success",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});

router.post("/enter", authenticateForHTTPEndpoints, async (req, res) => {
    try {
        // Receive room id and user info
        const { roomCode } = req.body;

        // Find the requesting room
        const room = await RoomServices.findRoomByRoomCode(roomCode);
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