// get-messages-service.js

import { Message } from "../../../models/message-model.js";
import { findRoom } from "../room/find-room-service.js";

// Retrieve all the messages sent to the room from the database
async function getMessages(roomCode) {
    try {
        // Fetch the target room
        const room = await findRoom(roomCode).select("_id").lean();
        if (!room) throw new Error("Room not found");

        // Fetch the messages sent over the target room using the Message model
        const messages = await Message.find({
            room: room._id,
        })
        .sort({ createdAt: 1 })
        .populate({
            path: "sender",
            select: "userId -_id" 
        }) // convert user object id to user public id
        .lean();

        return messages.map(msg => ({
            ...msg,
            userId: msg.sender?.userId
        }));
    } catch (err) {
        console.error("Failed to retrieve message history:", err);
        throw err;
    }
}

async function getPaginatedMessages(roomCode, messageType, limit = 50, cursor = null) {
    try {
        const room = await findRoom(roomCode).select("_id").lean();
        if (!room) throw new Error("Room not found");

        const query = {
            room: room._id,
            type: messageType
        };

        // Pagination using createdAt cursor
        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        return await Message.find(query)
            .sort({ createdAt: -1 }) // newest first for chat UI
            .limit(limit)
            .lean();
    } catch (err) {
        console.error("Failed to retrieve message history:", err);
        throw err;
    }
}

export { getMessages, getPaginatedMessages };