// fetch-older-messages-handler.js

import { getPaginatedConversation } from "../../../services/db-services/message/get-paginated-conversation-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

import { validateRoomCodeFormat } from "../../../../shared/validation/room-code-format-validator.js";

async function handleFetchOlderMessages(req, res) {
    try {
        // Retrieve room code of the requesting room
        const roomCode = req.params.roomCode;
        const { cursor } = req.query;
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

        // Fetch the next paginated conversation
        const result = await getPaginatedConversation(normalizedRoomCode, cursor);
        if (!result.success) {
            return res.status(result.statusCode).json(
                errorResponse(
                    "FETCH_MESSAGES_FAILED",
                    result.message
                )
            );
        }
        
        return res.status(200).json(
            successResponse(
                {
                    messages: result.messages,
                    nextCursor: result.nextCursor,
                    hasMore: result.hasMore      
                },
                "Fetch more messages success"
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

export { handleFetchOlderMessages };