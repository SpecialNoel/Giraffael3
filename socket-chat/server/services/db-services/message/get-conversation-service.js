// get-conversation-service.js

import { Message } from "../../../models/message-model.js";
import { findRoom } from "../room/find-room-service.js";

// Retrieve the whole conversation sent to the room from the database
async function getWholeConversation(roomCode) {
    try {
        // Fetch the target room
        const room = await findRoom(roomCode).select("_id").lean();
        if (!room) throw new Error("Room not found");

        // Fetch the whole conversation sent over the target room using the Message model
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

        // Return whole conversation sent over the room
        return conversation.map(msg => ({
            messageObjectId: msg._id,
            userId: msg.sender.userId,
            username: msg.sender.username,
            content: msg.content,
            type: msg.type,
        }));
    } catch (err) {
        console.error("Failed to retrieve whole conversation:", err);
        throw err;
    }
}

// Retrieve part of the conversation (via pagination) sent to the room from the database
async function getPaginatedConversation(roomCode, cursor=null, limit=5) {
    try {
        // Fetch the target room
        const room = await findRoom(roomCode).select("_id").lean();
        if (!room) throw new Error("Room not found");

        // Initialize a query used to fetch messages in the target room
        const query = {
            room: room._id
        };

        // Pagination (i.e. resume from where the message-fetching ended last time) using createdAt cursor
        // If cursor is null, it means that the conversation retrieval is called the first time
        // If cursor is not null, it means that the conversation retrieval is called again later
        if (cursor) query.createdAt = { $lt: new Date(cursor) };

        // Fetch some of the conversation sent over the target room using the Message model
        const messages = await Message.find(query)
            .select("sender content type createdAt")
            .sort({ createdAt: -1 }) // newest messages first
            .limit(limit)
            .populate({
                path: "sender",
                select: "userId username -_id" 
            }) // convert user object id to user public id
            .lean();

        // Used reverse() to sort the fetched messages by oldest messages first for easier access for UI
        const formattedMessages = messages
            .reverse()
            .map(msg => ({
                messageObjectId: msg._id,
                userId: msg.sender.userId,
                username: msg.sender.username,
                content: msg.content,
                type: msg.type,
                createdAt: msg.createdAt,
            }));

        // Return both the requested messages and the cursor for the next message-fetching
        return {
            messages: formattedMessages,
            nextCursor: formattedMessages.length > 0
                ? formattedMessages[0].createdAt
                : null
        };
    } catch (err) {
        console.error("Failed to retrieve message conversation with pagination:", err);
        throw err;
    }
}

export { getWholeConversation, getPaginatedConversation };