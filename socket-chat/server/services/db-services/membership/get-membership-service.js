// get-membership-service.js

import { Membership } from "../../../models/membership-model.js";
import { findRoom } from "../room/find-room-service.js";

// Get the user's membership in the target room
async function getMembership(userObjectId, normalizedRoomCode) {
    try {
        const room = await findRoom(normalizedRoomCode).select("_id");
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