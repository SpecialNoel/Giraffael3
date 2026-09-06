// leave-room-handler.js

import { leaveRoom } from "../../../services/db-services/membership/leave-room-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";
import { getMembersInRoom } from "../../../services/db-services/membership/get-members-in-room-service.js"
import { broadcastUserLeft } from "../../../services/socket/emitters/room-broadcaster.js";

import { validateRoomCodeFormat } from "../../../../shared/validation/room-code-format-validator.js";

async function handleLeaveRoom(req, res, io) {
    try {
        // Receive room code and user info
        const { roomCode } = req.body;
        const userObjectId = req.user.userObjectId;
        const normalizedRoomCode = roomCode.trim();

        // Validate input format
        const roomCodeFormatValidnessResult = validateRoomCodeFormat(normalizedRoomCode);
        if (!roomCodeFormatValidnessResult.success) {
            return res.status(400).json(
                errorResponse(
                    "INVALID_ROOM_CODE_FORMAT",
                    roomCodeFormatValidnessResult.message
                )
            );        
        }

        // Join the room
        const leaveRoomResult = await leaveRoom(userObjectId, normalizedRoomCode);
        
        // Handle join-room failure
        if (!leaveRoomResult.success) {
            switch (leaveRoomResult.reason) {
                case "NOT_IN_ROOM":
                    return res.status(400).json(
                        errorResponse(
                            "NOT_IN_ROOM",
                            "User is not in room yet"
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
        const members = await getMembersInRoom(normalizedRoomCode);
        
        // Notify these users about this event
        broadcastUserLeft(io, normalizedRoomCode, members);

        // Leave-room success
        return res.status(200).json(
            successResponse(
                {
                    normalizedRoomCode
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