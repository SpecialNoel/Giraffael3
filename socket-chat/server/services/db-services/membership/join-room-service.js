// join-room-service.js

import { Membership } from "../../../models/membership-model.js";
import { Room } from "../../../models/room-model.js";

// Add the user to the given room by creating a new membership,
// or re-activate the user's membership if it already exists
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

        // Try to fetch the associated membership from database
        const membership = await Membership.findOne({
            userObjectId,
            roomObjectId: room._id,
            active: false
        });
        if (membership) {
            // Update the existing membership document to re-join the user to the room
            membership.active = true;
            await membership.save();
            console.log("Updated membership")
            return {
                success: true,
                membership: membership
            };
        } else {
            // Create a new membership if membership is not found (i.e. user joined to this room for the first time)
            const newMembership = await Membership.create({
                userObjectId,
                roomObjectId: room._id,
                role,
                active: true
            }); 
            return {
                success: true,
                membership: newMembership
            };
        }
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