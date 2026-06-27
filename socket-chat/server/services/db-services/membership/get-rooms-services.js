// get-rooms-service.js

import { Membership } from "../../../models/membership-model.js";

async function getRoomsOfUser(userObjectId) {
    try {
        return await Membership.find({
            userObjectId
        });
    } catch (err) {
        console.error("Failed to get all rooms joined by user:", err);
        throw err;
    }
}

export { getRoomsOfUser };