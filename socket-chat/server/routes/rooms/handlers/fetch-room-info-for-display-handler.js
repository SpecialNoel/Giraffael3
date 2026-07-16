// fetch-room-info-for-display-handler.js

import { getRoomInfoForDisplay } from "../../services/db-services/room/get-room-info-for-display-service.js";

async function handleFetchRoomInfoForDisplay(req, res) {
    try {
        // Retrieve room code of the requesting room
        const roomCode = req.params.roomCode;

        // Retrieve the displaying info about the room
        const roomInfoForDisplay = await getRoomInfoForDisplay(roomCode);
        
        // Return the room displaying info
        return res.status(200).json({
            success: true,
            message: "Fetch room info for display success",
            roomInfoForDisplay
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

export { handleFetchRoomInfoForDisplay };