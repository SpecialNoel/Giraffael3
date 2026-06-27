// check-membership-service.js

import { Membership } from "../../../models/membership-model.js";

async function checkMembership(userObjectId, roomObjectId) {
    try {
        const membership = await Membership.findOne({
            userObjectId,
            roomObjectId
        });
        return membership !== null;
    } catch (err) {
        console.error("Failed to check user membership:", err);
        throw err;
    }
}

export { checkMembership };