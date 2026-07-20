// fetch-more-messages-handler.js

import { getPaginatedConversation } from "../../../services/db-services/message/get-conversation-service.js";

async function handleFetchMoreMessages(req, res) {
    try {
        // Retrieve room code of the requesting room
        const roomCode = req.params.roomCode;
        const { cursor } = req.query;

        const result = await getPaginatedConversation(roomCode, conversationCursor);
        
        return res.status(200).json({
            success: true,
            message: "Fetch more messages success",
            messages: result.messages,
            nextCursor: result.nextCursor
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

export { handleFetchMoreMessages };