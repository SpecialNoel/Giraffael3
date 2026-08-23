// update-user-service.js

import { User } from "../../../models/user-model.js";

// Update the username of the user in DB
// Return the updated username if succeeded; return null otherwise
async function updateUsername(userObjectId, username) {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userObjectId,
            { username },
            { new: true }
        );
        return updatedUser.username;
    } catch (err) {
        console.error("Failed to update username:", err);
        throw err;
    }
}

export { updateUsername };