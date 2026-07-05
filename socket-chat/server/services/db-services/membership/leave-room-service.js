// leave-room-service.js

import { Membership } from "../../../models/membership-model.js";
import { Room } from "../../../models/room-model.js";

// Set the user from the given room as inactive by updating the existing membership
async function leaveRoom(userObjectId, roomCode) {
    try {
        // Try to fetch the room from database
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

        // Try to fetch the associated membership from database
        const membership = await Membership.findOne({
            userObjectId,
            roomObjectId: room._id,
            active: true
        });
        if (!membership) {
            return {
                success: false, 
                reason: "NOT_IN_ROOM"
            };    
        }

        // Update the membership document to leave the user from the room
        membership.active = false;
        await membership.save();
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