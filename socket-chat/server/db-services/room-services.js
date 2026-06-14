// room-services.js

import { User } from "../models/user-model.js"
import { Room } from "../models/room-model.js"
import { generateRoomCode } from "../utils/crypto-value-generator.js";

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
    return await Room.findOne({ roomCode, deleted: false });
}

// Create a new room with the given room name, and store it to the database
async function createRoom(roomName, _id) {
    try {
        // Check if the user exists in the database
        const user = await User.findById(_id);
        if (!user) throw new Error("Creator not found");

        // Create and store the room to DB. Repeat if failed due to roomCode duplication
        let room;
        while (!room) {
            try {
                room = await Room.create({
                    roomCode: generateRoomCode(),
                    roomName,
                    creatorId: _id,
                    members: [_id],
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

// Delete the given room from the database
async function deleteRoom(roomCode) {
    try {
        // await Room.deleteOne({ roomCode }); // Hard-delete

        // Soft-delete: ”deleted” marked as true, messages 
        // still exist, and the room becomes inaccessible to everyone
        const date = new Date();
        await Room.findOneAndUpdate(
            { 
                roomCode: roomCode, 
                deleted: false 
            },
            {
                deleted: true,
                deletedAt: date
            }
        );
        console.log("Room deleted from DB\n");
        return date;
    } catch (err) {
        console.error("Failed to delete room:", err);
        throw err;
    }
}

// Add the user to the given room
async function joinRoom(roomCode, _id) {
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
        if (room.members.includes(_id)) {
            return {
                success: false,
                reason: "ALREADY_IN_ROOM"            
            };
        }

        // Update the room by adding the user to it
        const updatedRoom = await Room.findOneAndUpdate(
            { roomCode },
            { $addToSet: { members: _id } }, // add _id to the members list, if it is not in the list yet
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
async function leaveRoom(roomCode, _id) {
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
        if (!room.members.includes(_id)) {
            return {
                success: false,
                reason: "NOT_IN_ROOM"            
            };
        }

        // Update the room by removing the user to it
        await Room.findOneAndUpdate(
            { roomCode },
            { $pull: { members: _id } }, // remove _id from the members list
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

// Determine whether the user is the creator of the room
// _id is the object id of the creator of the room
async function isUserTheCreatorOfRoom(roomCode, _id) {
    try {
        const room = await findRoomByRoomCode(roomCode);
        return room.creatorId === _id;
    } catch (err) {
        console.error("Failed to check whether user is the creator of the room:", err);
        throw err;
    }
}

// Retrieve necessary information of rooms the user has joined
async function getRoomsInfo(_id) {
    return await Room.find({
        members: _id,
        deleted: false // exclude rooms that have been soft-deleted
    })
    .select("roomName roomCode creatorId -_id") // exclude the _id property of each Room document
    .populate({
        path: "creatorId",
        select: "userId -_id" 
    }); // convert the creator Id (a private object id) into userId of the creator (public id) to make it suitable for client-side logics 
}

export { findRoomCodes, findRoomByRoomCode, createRoom, deleteRoom, joinRoom, leaveRoom, isUserTheCreatorOfRoom, getRoomsInfo };
