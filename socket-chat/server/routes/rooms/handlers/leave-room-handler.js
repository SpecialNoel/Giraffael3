// leave-room-handler.js

import { leaveRoom } from "../../../services/db-services/membership/leave-room-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";
import { getMembersInRoom } from "../../../services/db-services/membership/get-members-service.js"
import { broadcastUserLeft } from "../../../socket/emitters/room-broadcaster.js";

async function handleLeaveRoom(req, res, io) {
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
                    return res.status(400).json(
                        errorResponse(
                            "NOT_IN_ROOM",
                            "User already in room"
                        )
                    );
                case "ROOM_NOT_FOUND":
                    return res.status(404).json(
                        errorResponse(
                            "ROOM_NOT_FOUND",
                            "Room not found"
                        )
                    );
                default: 
                    return res.status(500).json(
                        errorResponse(
                            "OTHER",
                            "Leave room failure"
                        )
                    );
            }
        }

        // Get every user who joined the room (excluding the leaving user) 
        const members = await getMembersInRoom(roomCode);
        
        // Notify these users about this event
        broadcastUserLeft(io, roomCode, members);

        // Leave-room success
        return res.status(200).json(
            successResponse(
                {
                    roomCode
                },
                "Leave room success"
            )
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json(
            errorResponse(
                "OTHER",
                "Internal server error"
            )
        );
    }
}

export { handleLeaveRoom };