// find-user-by-email-service.js

import { User } from "../../../models/user-model.js";

// Return the user if it already exists in DB; return null otherwise
async function findUserByEmail(normalizedEmail) {
    try {
        return await User.findOne({ email: normalizedEmail });
    } catch (err) {
        console.error("Failed to find user:", err);
        throw err;
    }
}

export { findUserByEmail };
