// room-services.js

import { User } from "../models/user-model.js"
import { Room } from "../models/room-model.js"
import { generateRoomCode } from "../utils/crypto-value-generator.js";

// Retrieve the target room by room code
async function findRoom(roomCode) {
    return await Room.findOne({ roomCode, deleted: false });
}

// Create a new room with the given room name, and store it to the database
async function createRoom(roomName, userObjectId) {
    try {
        // Check if the user exists in the database
        const user = await User.findById(userObjectId);
        if (!user) throw new Error("Creator not found");

        // Create and store the room to DB. Repeat if failed due to roomCode duplication
        let room;
        while (!room) {
            try {
                room = await Room.create({
                    roomCode: generateRoomCode(),
                    roomName,
                    creator: userObjectId,
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

export { findRoom, 
         createRoom, 
         deleteRoom };
