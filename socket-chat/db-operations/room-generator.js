// room-generator.js

import Room from "../models/room-model.js";
import retrieveAllRoomCodes from "./room-codes-retriever.js"
import generateRoomCode from "../room-code-generator.js";

// Create a new room with the given room name, and store it to the database
async function createRoom(roomName) {
    try {
        // Generate an unique room code
        const roomCodesInDB = await retrieveAllRoomCodes();
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

export default createRoom;
