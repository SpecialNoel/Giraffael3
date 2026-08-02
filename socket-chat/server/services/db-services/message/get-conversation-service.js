// get-conversation-service.js

import { Message } from "../../../models/message-model.js";
import { findRoom } from "../room/find-room-service.js";
import { INITIAL_MESSAGE_LIMIT, MESSAGE_FETCH_LIMIT } from "../../../config/constants.js";

// Retrieve part of the conversation (via pagination) sent to the room from the database
async function getPaginatedConversation(roomCode, cursor) {
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

        // The limit amount for message fetching should be the initial limit if the cursor is null,
        // and it should be the fetching limit if the cursor is not null (cursor explained above).
        const limit = cursor ? MESSAGE_FETCH_LIMIT : INITIAL_MESSAGE_LIMIT;

        // Fetch some of the conversation sent over the target room using the Message model
        const messages = await Message.find(query)
            .select("sender content type createdAt")
            .sort({ createdAt: -1 }) // newest messages first
            .limit(limit+1) // fetch one extra message document than requested to indicate whether there are older messages to fetch or not
            .populate({
                path: "sender",
                select: "userId username -_id" 
            }) // convert user object id to user public id
            .lean();

        // Indicate whether there are older messages to fetch or not
        const hasMore = messages.length > limit;
        // If there are, pop the extra message fetched before formatting the rest
        if (hasMore) messages.pop();

        // Format the messages to access attributes easier on client side
        const formattedMessages = messages
            .reverse() // Reverse the message so that oldest messages first, and newest messages last
            .map(msg => ({
                messageObjectId: msg._id,
                userId: msg.sender.userId,
                username: msg.sender.username,
                content: msg.content,
                type: msg.type,
                createdAt: msg.createdAt,
            }));

        // Return the requested messages, the cursor for the next message-fetching, and the hasMore indicator
        return {
            messages: formattedMessages, // messages with oldest first, newest last
            nextCursor: formattedMessages.length > 0 // the "createdAt" field of the oldest msg in this batch
                ? formattedMessages[0].createdAt
                : null,
            hasMore // whether there are messages of the room to be fetched
        };
    } catch (err) {
        console.error("Failed to retrieve message conversation with pagination:", err);
        throw err;
    }
}

export { getPaginatedConversation };