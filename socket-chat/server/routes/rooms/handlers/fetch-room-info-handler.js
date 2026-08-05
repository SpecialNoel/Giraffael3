// fetch-room-info-handler.js

import { getRoomInfo } from "../../../services/db-services/room/get-room-info-service.js";

async function handleFetchRoomInfo(req, res) {
    try {
        // Retrieve room code of the requesting room
        const roomCode = req.params.roomCode;

        // Retrieve room info
        const roomInfo = await getRoomInfo(roomCode);
        
        // Return the room info
        return res.status(200).json({
            success: true,
            message: "Fetch room info success",
            roomInfo
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

export { handleFetchRoomInfo };