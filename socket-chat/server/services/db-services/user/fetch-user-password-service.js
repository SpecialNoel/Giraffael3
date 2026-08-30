// fetch-user-password-service.js

import { User } from "../../../models/user-model.js";

// Fetch the password (hash) of the user from DB
// Return the password if the user exists; return null if the user does not exist
// Throw if a database error occurs
async function fetchUserPassword(userObjectId) {
    try {
        const user = await User.findById(userObjectId).select("passwordHash");
        return user ? user.passwordHash : null;
    } catch (err) {
        console.error("Failed to fetch user password:", err);
        throw err;
    }
}

export { fetchUserPassword };