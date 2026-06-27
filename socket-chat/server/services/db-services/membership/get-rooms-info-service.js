// get-rooms-info-service.js

import { Membership } from "../../../models/membership-model.js";

// Retrieve necessary information of rooms the user has joined
async function getRoomsInfo(userObjectId) {
    try {
        const memberships = await Membership.find({
            userObjectId
        })
        .populate({
            path: "roomObjectId", // focusing on the room documents
            match: { deleted: false }, // mark soft-deleted rooms as null
            select: "roomName roomCode creator" // get needed room information
        });

        return memberships
            .filter(membership => membership.roomObjectId) // filter out soft-deleted rooms
            .map(membership => ({ // formatting the information as a list of key-value pairs
                roomName: membership.roomObjectId.roomName,
                roomCode: membership.roomObjectId.roomCode,
                creator: membership.roomObjectId.creator,
                role: membership.role
            }));
    } catch (err) {
        console.error("Failed to get information of rooms joined by user:", err);
        throw err;
    }
}

export { getRoomsInfo };