// user-services.js

import { User } from "../models/user-model.js";
import { generateUserId } from "../utilities/user-id-generator.js";

// Create a new user, and store it to the database
async function createUser(email, passwordHash) {
    try {
        // Create and store the user to DB. Repeat if failed due to userId duplication
        let user;
        while (!user) {
            try {
                user = await User.create({
                    userId: generateUserId(),
                    email,
                    passwordHash
                });
            } catch (err) {
                if (err.code === 11000) continue; // duplicate key error of MondoDB; retry
                throw err; // otherwise, report error
            }
        } 
        console.log("User created and stored to DB\n");
        return user;
    } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
    }
}

// Return the user if it already exists in DB; return null otherwise
async function findUser(email) {
    try {
        return await User.findOne({ email: email.trim().toLowerCase() });
    } catch (error) {
        console.error("Failed to find user:", error);
        throw error;
    }
}

export { createUser, findUser };
