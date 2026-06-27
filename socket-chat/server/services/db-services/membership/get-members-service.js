// get-members-service.js

import { Room } from "../../../models/room-model.js";
import { Membership } from "../../../models/membership-model.js";

async function getMembersInRoom(roomCode) {
    try {
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id");

        return await Membership.find({
            roomObjectId: room._id
        });
    } catch (err) {
        console.error("Failed to get all members in room:", err);
        throw err;
    }
}

export { getMembersInRoom };