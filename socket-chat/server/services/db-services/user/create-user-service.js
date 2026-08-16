// create-user-service.js

import { User } from "../../../models/user-model.js";
import { generateIdentifier } from "../../../utils/id-generator.js";
import { generateUniqueDefaultUsername } from "../../../utils/username-generator.js";

// Create a new user, and store it to the database
async function createUser(email, passwordHash) {
    try {
        // Create and store the user to DB. Repeat if failed due to userId duplication
        let user;
        let username;
        while (!user) {
            try {
                username = await generateUniqueDefaultUsername();
                user = await User.create({
                    userId: generateIdentifier(),
                    username,
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

export { createUser };