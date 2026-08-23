// fetch-user-email-service.js

import { User } from "../../../models/user-model.js";

// Fetch the email of the user from DB
// Return the email if the user exists; return null if the user does not exist
// Throw if a database error occurs
async function fetchUserEmail(userObjectId) {
    try {
        const user = await User.findById(userObjectId).select("email");
        return user ? user.email : null;
    } catch (err) {
        console.error("Failed to fetch user email:", err);
        throw err;
    }
}

export { fetchUserEmail };