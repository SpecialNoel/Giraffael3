// get-room-info-service.js

import { Room } from "../../../models/room-model.js";

// Retrieve necessary information of rooms the user has joined
async function getRoomInfo(roomObjectId) {
    try {
        const room = await Room.findById(roomObjectId)
        .select("roomName roomCode deleted"); // get needed room information

        // Check room existence
        if (!room || room.deleted) return null;

        return {
            roomName: room.roomName,
            roomCode: room.roomCode,
        };
    } catch (err) {
        console.error("Failed to get information of room:", err);
        throw err;
    }
}

export { getRoomInfo };