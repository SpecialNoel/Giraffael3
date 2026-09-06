// has-role-by-room-code-service.js

import { Membership } from "../../../models/membership-model.js";
import { Room } from "../../../models/room-model.js";

// Determine whether the user has the target role in the room
// Note: types for role can be accessed in the Membership schema; "participant" refers to any role
async function hasRoleByRoomCode(userObjectId, normalizedRoomCode, role) {
    try {
        // Find the target room
        const room = await Room.findOne({
            roomCode: normalizedRoomCode,
            deleted: false
        }).select("_id");
        if (!room) return false;

        // Check whether the user has any role in the room
        if (role === "participant") {
            return await Membership.exists({
                userObjectId,
                roomObjectId: room._id,
                active: true
            });        
        }

        // Check whether the user has a specific role in the room
        return await Membership.exists({
            userObjectId,
            roomObjectId: room._id,
            role: role,
            active: true
        });
    } catch (err) {
        console.error("Failed to check whether user has the target role in the room:", err);
        throw err;
    }
}

export { hasRoleByRoomCode };