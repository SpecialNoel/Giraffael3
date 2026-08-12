// fetch-older-messages-handler.js

import { getPaginatedConversation } from "../../../services/db-services/message/get-conversation-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleFetchOlderMessages(req, res) {
    try {
        // Retrieve room code of the requesting room
        const roomCode = req.params.roomCode;
        const { cursor } = req.query;

        const result = await getPaginatedConversation(roomCode, cursor);
        
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