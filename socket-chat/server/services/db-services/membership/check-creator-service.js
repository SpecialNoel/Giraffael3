// check-creator-service.js

import { Membership } from "../../../models/membership-model.js";
import { Room } from "../../../models/room-model.js";

// Determine whether the user is the creator of the room
async function isCreatorByRoomCode(userObjectId, roomCode) {
    try {
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id");
        if (!room) return false;

        return await Membership.exists({
            userObjectId,
            roomObjectId: room._id,
            role: "creator"
        });
    } catch (err) {
        console.error("Failed to check whether user is the creator of the room:", err);
        throw err;
    }
}

export { isCreatorByRoomCode };