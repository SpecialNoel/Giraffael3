// get-rooms-of-user-service.js

import { Membership } from "../../../models/membership-model.js";

// Get memberships all the rooms that user has joined and is currently in
async function getRoomsOfUser(userObjectId) {
    try {
        return await Membership.find({
            userObjectId,
            active: true
        });
    } catch (err) {
        console.error("Failed to get all rooms joined by user:", err);
        throw err;
    }
}

export { getRoomsOfUser };