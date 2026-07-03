// get-membership-service.js

import { Membership } from "../../../models/membership-model.js";
import { Room } from "../../../models/room-model.js";

// Get the member's role in the target room
async function getMembership(userObjectId, roomCode) {
    try {
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id");
        if (!room) return false;

        return await Membership.findOne({
            userObjectId,
            roomObjectId: room._id,
        });
    } catch (err) {
        console.error("Failed to get user membership:", err);
        throw err;
    }
}

export { getMembership };