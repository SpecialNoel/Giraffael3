// message-services.js

import { Message } from "../models/message-model.js";
import { User } from "../models/user-model.js";
import { Room } from "../models/room-model.js";
import { findRoomByRoomCode } from "../db-services/room-services.js";

const MESSAGE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

// Store the chat message to the database
async function storeMessage(roomId, _id, content) {
    try {
        // Check if the user exists in the database
        const user = await User.findById(_id);
        if (!user) throw new Error("Sender not found");

        // Auto-delete this message 1 hour after creation
        const expireAt = new Date(Date.now() + MESSAGE_EXPIRATION_MS);

        // Construct and store the message using the Message model
        const message = await Message.create({
            room: roomId,
            sender: _id,
            content,
            expireAt
        });
        console.log("Message saved to DB\n");
        return message;
    } catch (err) {
        console.error("Failed to store message:", err);
        throw err;
    }
}

// Retrieve all the messages sent to the room from the database
async function getMessageHistory(roomCode) {
    try {
        // Fetch the target room
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id").lean();
        if (!room) throw new Error("Room not found");

        // Fetch the messages sent over the target room 
        return await Message.find({
            room: room._id,
        }).sort({ createdAt: 1 }).lean();
    } catch (err) {
        console.error("Failed to retrieve message history:", err);
        throw err;
    }
}

async function getMessageHistoryWithPagination(roomCode, messageType, limit = 50, cursor = null) {
    try {
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id").lean();
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

export { storeMessage, getMessageHistory, getMessageHistoryWithPagination };