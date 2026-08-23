// fetch-username-service.js

import { User } from "../../../models/user-model.js";

// Fetch the username of the user from DB
// Return the username if the user exists; return null if the user does not exist
// Throw if a database error occurs
async function fetchUsername(userObjectId) {
    try {
        const user = await User.findById(userObjectId).select("username");
        return user ? user.username : null;
    } catch (err) {
        console.error("Failed to fetch username:", err);
        throw err;
    }
}

export { fetchUsername };