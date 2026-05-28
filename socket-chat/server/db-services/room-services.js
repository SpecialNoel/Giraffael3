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
        // Generate an unique room code for this room
        const roomCodesInDB = await findRoomCodes();
        let roomCode;
        do {
            roomCode = generateRoomCode();
        } while (roomCodesInDB.has(roomCode));

        // Create the new room
        const newRoom = new Room({
            roomCode: roomCode,
            roomName: roomName,
            creator: creatorId,
            members: [creatorId]
        });

        // Store the room to the DB
        const generatedRoom = await newRoom.save();
        console.log("Room generated and stored to DB\n");
        return generatedRoom;
    } catch (error) {
        console.error("Failed to create room:", error);
        throw error;
    }
}

// Join the user to the given room (update it in DB)
async function addUserToRoom(roomCode, userId) {
    try {
        // Get the user document based on user _id
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        await Room.findOneAndUpdate(
            { roomCode },
            { $addToSet: { members: user._id } },
            { new: true }
        );
    } catch (error) {
        console.error("Failed to add user to room:", error);
        throw error;
    }
}

export { findRoomCodes, addUserToRoom, createRoom };
