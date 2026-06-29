// leave-room-handler.js

import { leaveRoom } from "../../services/db-services/membership/leave-room-service.js";

async function handleLeaveRoom(req, res) {
    try {
        // Receive room code and user info
        const { roomCode } = req.body;
        const userObjectId = req.user.userObjectId;

        // Join the room
        const leaveRoomResult = await leaveRoom(userObjectId, roomCode);
        
        // Handle join-room failure
        if (!leaveRoomResult.success) {
            switch (leaveRoomResult.reason) {
                case "NOT_IN_ROOM":
                    return res.status(400).json({
                        success: false,
                        code: "NOT_IN_ROOM",
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
            success: false,
            code: "OTHER",
            error: "Internal server error"
        });    
    }
}

export { handleLeaveRoom };