// get-room-info-service.js

import { Room } from "../../../models/room-model.js"

// Retrieve the target room info
async function getRoomInfo(roomCode) {
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
        console.error("Failed to get room info:", err);
        throw err;
    }
}

export { getRoomInfo };
