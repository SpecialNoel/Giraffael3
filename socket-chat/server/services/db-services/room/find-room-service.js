// find-room-service.js

import { Room } from "../../../models/room-model.js"

// Retrieve the target room by room code; return null if room does not exist in database
function findRoom(normalizedRoomCode) {
    return Room.findOne(
        { 
            roomCode: normalizedRoomCode, 
            deleted: false 
        });
}

export { findRoom };