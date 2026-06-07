// room-services.js

import { User } from "../models/user-model.js"
import { Room } from "../models/room-model.js"
import { generateRoomCode } from "../utilities/room-code-generator.js";

// Retrieve all existing room codes from the database
async function findRoomCodes() {
    try {
        // Fetch the room code of each room
        const rooms = await Room.find({}, "roomCode");

        // Convert the room codes into a Set for fast lookup
        return new Set(rooms.map(room => room.roomCode));
    } catch (err) {
        console.error("Error in retrieving room codes:", err);
        throw err;
    }
}

// Retrieve the target room by room code
async function findRoomByRoomCode(roomCode) {
    return await Room.findOne({ roomCode });
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
    } catch (err) {
        console.error("Failed to create room:", err);
        throw err;
    }
}

// Add the user to the given room
async function joinRoom(roomCode, userId) {
    try {
        // Check for existence of the room
        const room = await findRoomByRoomCode(roomCode);
        if (!room) { 
            return {
                success: false,
                reason: "ROOM_NOT_FOUND"
            };
        }

        // Check the user has already joined the room or not
        if (room.members.includes(userId)) {
            return {
                success: false,
                reason: "ALREADY_IN_ROOM"            
            };
        }

        // Update the room by adding the user to it
        const updatedRoom = await Room.findOneAndUpdate(
            { roomCode },
            { $addToSet: { members: userId } }, // add userId to the members list, if it is not in the list yet
            { new: true } // get the updated Room document
        );
        
        // Return the updated room
        return {
            success: true,
            room: updatedRoom
        };
    } catch (err) {
        console.error("Failed to add user to room:", err);
        throw err;
    }
}

// Remove the user to the given room
async function leaveRoom(roomCode, userId) {
    try {
        // Check for existence of the room
        const room = await findRoomByRoomCode(roomCode);
        if (!room) { 
            return {
                success: false,
                reason: "ROOM_NOT_FOUND"
            };
        }

        // Check if the user is currently not in the room 
        if (!room.members.includes(userId)) {
            return {
                success: false,
                reason: "NOT_IN_ROOM"            
            };
        }

        // Update the room by removing the user to it
        await Room.findOneAndUpdate(
            { roomCode },
            { $pull: { members: userId } }, // remove userId from the members list
            { new: true } // get the updated Room document
        );
        
        // Return the updated room
        return {
            success: true
        };
    } catch (err) {
        console.error("Failed to remove user from room:", err);
        throw err;
    }
}

// Retrieve necessary information of rooms the user has joined
async function getRoomsInfo(userId) {
    return await Room.find({
        members: userId
    }).select("roomName roomCode -_id"); // exclude the _id property of each Room document
}

export { findRoomCodes, findRoomByRoomCode, createRoom, joinRoom, leaveRoom, getRoomsInfo };
