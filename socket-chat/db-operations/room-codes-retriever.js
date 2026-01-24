// room-codes-retriever.js

import Room from "../models/room-model.js";

// Retrieve room codes of all rooms stored in the DB
async function retrieveAllRoomCodes() {
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

export default retrieveAllRoomCodes;
