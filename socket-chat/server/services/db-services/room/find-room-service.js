// find-room-service.js

import { Room } from "../../../models/room-model.js"

// Retrieve the target room by room code
function findRoom(roomCode) {
    return Room.findOne({ roomCode, deleted: false });
}

export { findRoom };