// room-services.js

import User from "../models/user-model.js"
import Room from "../models/room-model.js"
import generateRoomCode from "../utilities/room-code-generator.js";

// Retrieve all existing room codes from the database
async function findRoomCodes() {
    try {
        // Fetch the roomCode field of each room
        const rooms = await Room.find({}, "roomCode");

        // Convert the room codes into a Set for fast lookup
        return new Set(rooms.map(room => room.roomCode));
    } catch (error) {
        console.error("Error in retrieving room codes:", error);
        throw error;
    }
}

// Create a new room with the given room name, and store it to the database
async function createRoom(roomName, creatorId) {
    try {
        // Check if the creatorId exists in the database
        const user = await User.findById(creatorId);
        if (!user) throw new Error("Creator not found");

        // Generate an unique room code for this room
        const roomCodesInDB = await findRoomCodes();
        let room;
        while (!room) {
            try {
                room = await Room.create({
                    roomCode: generateRoomCode(),
                    roomName,
                    creator: creatorId,
                    members: [creatorId]
                });
            } catch (err) {
                if (err.code === 11000) continue; // duplicate key, retry
                throw err; // otherwise, report error
            }
        }
        console.log("Room created and stored to DB\n");
        return room;
    } catch (error) {
        console.error("Failed to create room:", error);
        throw error;
    }
}

// Join the user to the given room (update it in DB)
async function addUserToRoom(roomCode, userId) {
    try {
        return await Room.findOneAndUpdate(
            { roomCode },
            { $addToSet: { members: userId } },
            { new: true }
        );
    } catch (error) {
        console.error("Failed to add user to room:", error);
        throw error;
    }
}

export { findRoomCodes, addUserToRoom, createRoom };
