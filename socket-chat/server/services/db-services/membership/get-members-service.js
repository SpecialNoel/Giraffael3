// get-members-service.js

import { Room } from "../../../models/room-model.js";
import { Membership } from "../../../models/membership-model.js";

// Get all the active memberships in the room (inactive memberships means that the user has left the room)
async function getMembersInRoom(roomCode) {
    try {
        // Fetch the room
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id");
        if (!room) return null;

        // Fetch the active memberships inside the room
        const memberships = await Membership.find({
            roomObjectId: room._id,
            active: true
        })
        .populate({
            path: "userObjectId",
            select: "userId username"
        }); // attach some attributes from the corresponding User document to userObjectId

        // Return a list of { userId, username } rather than a list of memberships
        return memberships.map(membership => ({
            userId: membership.userObjectId.userId,
            username: membership.userObjectId.username
        }));
    } catch (err) {
        console.error("Failed to get all members with active membership in room:", err);
        throw err;
    }
}

export { getMembersInRoom };