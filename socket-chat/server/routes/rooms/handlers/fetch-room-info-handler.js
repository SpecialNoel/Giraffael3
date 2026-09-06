// fetch-room-info-handler.js

import { getRoomInfo } from "../../../services/db-services/room/get-room-info-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

import { validateRoomCodeFormat } from "../../../../shared/validation/room-code-format-validator.js";
import { hasRoleByRoomCode } from "../../../services/db-services/membership/has-role-by-room-code-service.js";

async function handleFetchRoomInfo(req, res) {
    try {
        // Retrieve room code of the requesting room
        const roomCode = req.params.roomCode;
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

        // Check whether the user is a participant of the room
        if (!hasRoleByRoomCode(userObjectId, normalizedRoomCode, "participant")) {
            return res.status(403).json(
                errorResponse(
                    "INVALID_USER_ROLE",
                    "Failed to fetch room info due to not being a participant of the room"
                )
            );               
        }

        // Retrieve room info
        const roomInfo = await getRoomInfo(normalizedRoomCode);
        
        // Return the room info
        return res.status(200).json(
            successResponse(
                {
                    roomInfo
                },
                "Fetch room info success"
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

export { handleFetchRoomInfo };