// join-room-service.js

import { Membership } from "../../../models/membership-model.js";
import { Room } from "../../../models/room-model.js";

// Add the user to the given room by creating a new membership
async function joinRoom(userObjectId, roomCode, role) {
    try {
        // Check room existence
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id");
        if (!room) {
            return {
                success: false,
                reason: "ROOM_NOT_FOUND",
                membership: null
            };
        }

        // Create a new membership
        const newMembership = await Membership.create({
            userObjectId,
            roomObjectId: room._id,
            role
        });
        return {
            success: true,
            membership: newMembership
        };
    } catch (err) {
        // Handle duplicate key error, which is fired by unique index of the Membership schema 
        if (err.code === 11000) {
            return {
                success: false,
                reason: "ALREADY_IN_ROOM",
                membership: null
            };
        }
        // Handle other errors
        console.error("Failed to join user to room:", err);
        throw err;
    }
}

export { joinRoom };