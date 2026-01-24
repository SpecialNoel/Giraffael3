// user-generator.js

import User from "../models/user-model.js";
import retrieveAllUserIds from "./user-ids-retriever.js"
import generateUserId from "../user-id-generator.js";

// Create a new user with the given username, and store it to the database
async function createUser(username) {
    try {
        // Generate an unique user id
        const userIdsInDB = await retrieveAllUserIds();
        let userId;
        do {
            userId = generateUserId();
        } while (userIdsInDB.has(userId));

        // Create a new user with the user id and given username
        const newUser = new User({
            userId: userId,
            username: username
        });

        // Store the user to the DB
        const generatedUser = await newUser.save();
        console.log("User generated and stored to DB\n");
        return generatedUser;
    } catch (error) {
        console.error("Error in generating user and storing it to DB:", error);
        throw error;
    }
}

export default createUser;
