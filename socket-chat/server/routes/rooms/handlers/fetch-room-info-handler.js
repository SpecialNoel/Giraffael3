// fetch-room-info-handler.js

import { getRoomInfo } from "../../../services/db-services/room/get-room-info-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleFetchRoomInfo(req, res) {
    try {
        // Retrieve room code of the requesting room
        const roomCode = req.params.roomCode;

        // Retrieve room info
        const roomInfo = await getRoomInfo(roomCode);
        
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