// user-ids-retriever.js

import User from "../models/user-model.js";

// Retrieve user ids of all users stored in the DB
async function retrieveAllUserIds() {
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

export default retrieveAllUserIds;
