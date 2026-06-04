// room-services.js

import User from "../models/user-model.js"
import Room from "../models/room-model.js"
import generateRoomCode from "../utilities/room-code-generator.js";

// Retrieve all existing room codes from the database
async function findRoomCodes() {
    try {
        // Fetch the room code of each room
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
        // Check if the user exists in the database
        const user = await User.findById(creatorId);
        if (!user) throw new Error("Creator not found");

        // Create and store the room to DB. Repeat if failed due to roomCode duplication
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
                if (err.code === 11000) continue; // duplicate key error of MongoDB; retry
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

// Add the user to the given room
async function addUserToRoom(roomCode, userId) {
    try {
        // Find and update the room in DB
        return await Room.findOneAndUpdate(
            { roomCode },
            { $addToSet: { members: userId } }, // add userId to the members list, if it is not in the list yet
            { new: true } // return the updated Room document
        );
    } catch (error) {
        console.error("Failed to add user to room:", error);
        throw error;
    }
}

// Retrieve necessary information of rooms the user has joined
async function getRoomsInfo(userId) {
    return await Room.find({
        members: userId
    }).select("roomName roomCode -_id"); // exclude the _id property of each Room document
}

export { findRoomCodes, createRoom, addUserToRoom, getRoomsInfo };
