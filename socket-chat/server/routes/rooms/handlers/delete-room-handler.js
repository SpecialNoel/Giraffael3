// delete-room-handler.js

import { deleteRoom } from "../../../services/db-services/room/delete-room-service.js";
import { hasRoleByRoomCode } from "../../../services/db-services/membership/has-role-by-room-code-service.js";
import { broadcastRoomDeleted } from "../../../services/socket/emitters/room-broadcaster.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

import { validateRoomCodeFormat } from "../../../../shared/validation/room-code-format-validator.js";

async function handleDeleteRoom(req, res, io) {
    try {
        // Receive room name and user info
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
        
        // Handle case where received userObjectId does not match the room's creator id
        if (!hasRoleByRoomCode(userObjectId, normalizedRoomCode, "creator")) {
            return res.status(401).json(
                errorResponse(
                    "NOT_CREATOR_OF_ROOM",
                    "Failed to delete room due to not being the creator of the room"
                )
            );
        }

        // Broadcast the room deletion to all users who joined this room via socket events BEFORE actual room deletion
        broadcastRoomDeleted(io, normalizedRoomCode);

        // Delete the room from the database
        const deletedAt = await deleteRoom(normalizedRoomCode);

        // Delete-room success
        return res.status(200).json(
            successResponse(
                {
                    deletedAt
                },
                "Delete room success"
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

export { handleDeleteRoom };