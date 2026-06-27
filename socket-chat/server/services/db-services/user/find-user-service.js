// find-user-service.js

import { User } from "../../../models/user-model.js";

// Return the user if it already exists in DB; return null otherwise
async function findUserByEmail(email) {
    try {
        return await User.findOne({ email: email.trim().toLowerCase() });
    } catch (err) {
        console.error("Failed to find user:", err);
        throw err;
    }
}

export { findUserByEmail };
