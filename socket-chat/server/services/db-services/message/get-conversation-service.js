// get-conversation-service.js

import { Message } from "../../../models/message-model.js";
import { findRoom } from "../room/find-room-service.js";

// Retrieve the conversation sent to the room from the database
async function getConversation(roomCode) {
    try {
        // Fetch the target room
        const room = await findRoom(roomCode).select("_id").lean();
        if (!room) throw new Error("Room not found");

        // Fetch the conversation sent over the target room using the Message model
        const conversation = await Message.find({
            room: room._id,
        })
        .select("sender content type")
        .sort({ createdAt: 1 })
        .populate({
            path: "sender",
            select: "userId username -_id" 
        }) // convert user object id to user public id
        .lean();

        // Return conversation sent over the room
        return conversation.map(msg => ({
            messageObjectId: msg._id,
            userId: msg.sender.userId,
            username: msg.sender.username,
            content: msg.content,
            type: msg.type,
        }));
    } catch (err) {
        console.error("Failed to retrieve conversation:", err);
        throw err;
    }
}

// Retrieve part of the conversation (via pagination) sent to the room from the database
async function getPaginatedConversation(roomCode, messageType, limit=50, cursor=null) {
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
        console.error("Failed to retrieve message conversation:", err);
        throw err;
    }
}

export { getConversation, getPaginatedConversation };