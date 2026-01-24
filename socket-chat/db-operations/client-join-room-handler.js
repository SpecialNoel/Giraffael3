// client-join-room-handler.js

import User from "../models/user-model.js"
import Room from "../models/room-model.js"

// Join the client to the given room (update it in DB)
async function joinClientToRoom(roomCode, userId) {
    try {
        // Find the user
        const user = await User.findOne({ userId: userId });
        if (!user) throw new Error("User not found");

        await Room.findOneAndUpdate(
            { roomCode },
            { $addToSet: { members: user._id } },
            { new: true }
        );
    } catch (error) {
        console.error("Error in joining client to room:", error);
        throw error;
    }
}

export default joinClientToRoom;
