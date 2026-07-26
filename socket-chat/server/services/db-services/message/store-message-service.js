// store-message-service.js

import { User } from "../../../models/user-model.js";
import { Message } from "../../../models/message-model.js";
import { findRoom } from "../room/find-room-service.js";
import { getMessageWithNYTimezone } from "../../../utils/timezone-converter.js";
import { MESSAGE_EXPIRATION_MS, MESSAGE_CLEANUP_INTERVAL_MS} from "../../../config/constants.js";

// Store the chat message to the database
async function storeMessage(roomCode, userObjectId, content, type) {
    try {
        // Check if the user exists in the database
        const user = await User.exists({ _id: userObjectId });
        if (!user) throw new Error("Sender not found");

        // Fetch the target room
        const room = await findRoom(roomCode).select("userObjectId");
        if (!room) throw new Error("Room not found");

        // Auto-delete this message 1 hour after creation
        const expiresAt = new Date(Date.now() + MESSAGE_EXPIRATION_MS);

        // Construct and store the message using the Message model
        const message = await Message.create({
            room: room._id,
            sender: userObjectId,
            content: content,
            type,
            expiresAt
        });

        const convertedMessage = getMessageWithNYTimezone(message);
        console.log(`Message saved to DB. Expires at ${convertedMessage.expiresAt}\n`);
        return message;
    } catch (err) {
        console.error("Failed to store message:", err);
        throw err;
    }
}

// Store the chat message to the database
async function storeTextMessage(roomCode, userObjectId, content) {
    // Store the message to MongoDB
    return await storeMessage(roomCode, userObjectId, content, "text");
}

export { storeMessage, storeTextMessage };