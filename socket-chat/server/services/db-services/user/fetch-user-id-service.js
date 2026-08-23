// fetch-user-id-service.js

import { User } from "../../../models/user-model.js";

// Fetch the userId of the user from DB
// Return the userId if the user exists; return null if the user does not exist
// Throw if a database error occurs
async function fetchUserId(userObjectId) {
    try {
        const user = await User.findById(userObjectId).select("userId");
        return user ? user.userId : null;
    } catch (err) {
        console.error("Failed to fetch user id:", err);
        throw err;
    }
}

export { fetchUserId };