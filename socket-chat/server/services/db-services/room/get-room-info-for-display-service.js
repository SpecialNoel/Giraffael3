// get-room-info-for-display-service.js

import { Room } from "../../../models/room-model.js"

// Retrieve the displaying info about the target room
async function getRoomInfoForDisplay(roomCode) {
    try {
        const room = await Room.findOne(
            { roomCode, deleted: false},
            "roomName roomCode"
        );
        if (!room) return null;

        return {
            roomCode: room.roomCode,
            roomName: room.roomName,
        };
    } catch (err) {
        console.error("Failed to get room info for display:", err);
        throw err;
    }
}

export { getRoomInfoForDisplay };
