// create-room-handler.js

import { createRoom } from "../../services/db-services/room/create-room-service.js";
import { joinRoom } from "../../services/db-services/membership/join-room-service.js";

async function handleCreateRoom(req, res) {
    try {
        // Receive room name and creator info
        const { roomName } = req.body;
        const userObjectId = req.user.userObjectId;

        // Create the room
        const room = await createRoom(roomName, userObjectId);

        // Create membership by join to the room
        const joinRoomResult = await joinRoom(userObjectId, room.roomCode, "creator");

        // Handle join-room failure
        if (!joinRoomResult.success) {
            switch (joinRoomResult.reason) {
                case "ALREADY_IN_ROOM":
                    return res.status(409).json({
                        success: false,
                        code: "ALREADY_IN_ROOM",
                        error: "User already in room",
                    });
                case "ROOM_NOT_FOUND":
                    return res.status(404).json({
                        success: false,
                        code: "ROOM_NOT_FOUND",
                        error: "Room not found",
                    });
                default: 
                    return res.status(500).json({
                        success: false,
                        code: "OTHER",
                        error: "Join room failure",
                    });
            }
        }

        // Retrieve necessary info about this new room
        const roomInfo = { roomName: room.roomName, 
                           roomCode: room.roomCode };

        // Create-room success
        return res.status(200).json({
            success: true,
            message: "Create room success",
            roomInfo: roomInfo
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            code: "OTHER",
            error: "Internal server error"
        });    
    }
}

export { handleCreateRoom };