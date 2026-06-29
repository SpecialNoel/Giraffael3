// enter-room-handler.js

import { findRoom } from "../../services/db-services/room/find-room-service.js";

async function handleEnterRoom(req, res) {
    try {
        // Receive room id and user info
        const { roomCode } = req.body;

        // Find the requesting room
        const room = await findRoom(roomCode);
        // Handle error where the requesting room does not exist in DB
        if (!room) {
            console.log(`Room does not exist in DB:`);
            return res.status(401).json({ 
                success: false,
                code: "ROOM_NOT_FOUND",
                error: "Invalid request"
            });
        }

        // Enter-room success
        return res.status(200).json({
            success: true,
            message: "Enter room success",
            members: room.members
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

export { handleEnterRoom };