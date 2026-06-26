// message-services.js

import { Message } from "../models/message-model.js";
import { User } from "../models/user-model.js";
import { Room } from "../models/room-model.js";
import { findRoom } from "./room-services.js";

const MESSAGE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

// Store the chat message to the database
async function storeMessage(roomCode, userObjectId, msgContent, type) {
    try {
        // Check if the user exists in the database
        const user = await User.exists({ userObjectId });
        if (!user) throw new Error("Sender not found");

        // Fetch the target room
        const room = findRoom(roomCode).select("userObjectId");
        if (!room) throw new Error("Room not found");

        // Auto-delete this message 1 hour after creation
        const expiresAt = new Date(Date.now() + MESSAGE_EXPIRATION_MS);

        // Construct and store the message using the Message model
        const message = await Message.create({
            room: room._id,
            sender: userObjectId,
            content: msgContent,
            type,
            expiresAt
        });
        console.log("Message saved to DB\n");
        return message;
    } catch (err) {
        console.error("Failed to store message:", err);
        throw err;
    }
}

// Retrieve all the messages sent to the room from the database
async function getMessages(roomCode) {
    try {
        // Fetch the target room
        const room = findRoom(roomCode).select("_id").lean();
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
        const room = findRoom(roomCode).select("_id").lean();
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

export { storeMessage, getMessages, getPaginatedMessages };