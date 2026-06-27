// leave-room-service.js

import { Membership } from "../../../models/membership-model.js";
import { Room } from "../../../models/room-model.js";

// Remove the user from the given room by deleting the existing membership
async function leaveRoom(userObjectId, roomCode) {
    try {
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id").lean();
        if (!room) {
            return {
                success: false, 
                reason: "ROOM_NOT_FOUND"
            };
        }

        const result = await Membership.deleteOne({
            userObjectId,
            roomObjectId: room._id
        });
        if (result.deletedCount === 0) {
            return {
                success: false, 
                reason: "NOT_IN_ROOM"
            };    
        }

        return {
            success: true
        };
    } catch (err) {
        console.error("Failed to leave user from room:", err);
        return {
            success: false, 
            reason: "INTERNAL_ERROR"
        }
    }
}

export { leaveRoom };