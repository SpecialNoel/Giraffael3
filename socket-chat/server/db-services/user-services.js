// user-services.js

import { User } from "../models/user-model.js";
import { generateUserId } from "../utils/crypto-value-generator.js";

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
    } catch (err) {
        console.error("Failed to create user:", err);
        throw err;
    }
}

// Return the user if it already exists in DB; return null otherwise
async function findUserByEmail(email) {
    try {
        return await User.findOne({ email: email.trim().toLowerCase() });
    } catch (err) {
        console.error("Failed to find user:", err);
        throw err;
    }
}

export { createUser, findUserByEmail };
