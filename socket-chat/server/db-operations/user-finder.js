// user-finder.js

import User from "../models/user-model.js";

// Find the user with the given email
// Return true if user already exists in DB; return false otherwise
async function findUserInDB(email) {
    try {
        const user = await User.findOne({ userEmail: email });
        return user;
    } catch (error) {
        console.error("Error in checking user existence in DB:", error);
        throw error;
    }
}

export default findUserInDB;
