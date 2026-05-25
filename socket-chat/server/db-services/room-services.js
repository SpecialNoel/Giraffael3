// room-services.js

import User from "../models/user-model.js"
import Room from "../models/room-model.js"
import generateRoomCode from "../utilities/room-code-generator.js";

// Retrieve room codes of all rooms stored in the DB
async function findRoomCodes() {
    try {
        // roomCode: 1 means to include the roomCode field
        // _id: 0 means to exclude the _id field
        const roomsInDB = await Room.find({}, { roomCode: 1, _id: 0 });
        const roomCodesInDB = roomsInDB.map(room => room.roomCode);
        return new Set(roomCodesInDB);
    } catch (error) {
        console.error("Error in retrieving all room codes from DB:", error);
        throw error;
    }
}

// Create a new room with the given room name, and store it to the database
async function createRoom(roomName) {
    try {
        // Generate an unique room code
        const roomCodesInDB = await findRoomCodes();
        let roomCode;
        do {
            roomCode = generateRoomCode();
        } while (roomCodesInDB.has(roomCode));

        // Create a new room with the room code and given room name
        const newRoom = new Room({
            roomCode: roomCode,
            roomName: roomName,
            members: []
        });

        // Store the room to the DB
        const generatedRoom = await newRoom.save();
        console.log("Room generated and stored to DB\n");
        return generatedRoom;
    } catch (error) {
        console.error("Error in generating room and storing it to DB:", error);
        throw error;
    }
}

// Join the client to the given room (update it in DB)
async function addUserToRoom(roomCode, userId) {
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

export { findRoomCodes, addUserToRoom, createRoom };
