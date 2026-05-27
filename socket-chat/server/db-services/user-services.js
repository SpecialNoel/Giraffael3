// user-services.js

import User from "../models/user-model.js";
import generateUserId from "../utilities/user-id-generator.js";

// Retrieve user ids of all users stored in the DB
async function findUserIds() {
    try {
        // userId: 1 means to include the userId field
        // _id: 0 means to exclude the _id field
        const usersInDB = await User.find({}, { userId: 1, _id: 0 });
        const userIdsInDB = usersInDB.map(user => user.userId);
        return new Set(userIdsInDB);
    } catch (error) {
        console.error("Error in retrieving all user ids from DB:", error);
        throw error;
    }
}

// Create a new user with the given username, and store it to the database
async function createUser(email, passwordHash) {
    try {
        // Generate an unique user id
        const userIdsInDB = await findUserIds();
        let userId;
        do {
            userId = generateUserId();
        } while (userIdsInDB.has(userId));

        // Create a new user with an empty username
        const newUser = new User({
            userId: userId,
            username: "",
            email: email,
            passwordHash: passwordHash
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

// Return the user if it already exists in DB; return null otherwise
async function findUser(email) {
    try {
        return await User.findOne({ email: email });
    } catch (error) {
        console.error("Error in checking user existence in DB:", error);
        throw error;
    }
}

export { createUser, findUser };
