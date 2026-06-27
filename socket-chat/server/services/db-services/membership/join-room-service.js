// join-room-service.js

import { Membership } from "../../../models/membership-model.js";
import { Room } from "../../../models/room-model.js";

// Add the user to the given room by creating a new membership
async function joinRoom(userObjectId, roomObjectId, role) {
    try {
        // Check room existence
        const roomExists = await Room.exists({ _id: roomObjectId });
        if (!roomExists) {
            return {
                success: false,
                reason: "Room not found",
                membership: null
            };
        }

        // Create a new membership
        const newMembership = await Membership.create({
            userObjectId,
            roomObjectId,
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
                reason: "Already a member of room",
                membership: null
            };
        }
        // Handle other errors
        console.error("Failed to join user to room:", err);
        throw err;
    }
}

export { joinRoom };