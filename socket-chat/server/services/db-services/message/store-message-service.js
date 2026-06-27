// store-message-service.js

import { User } from "../../../models/user-model.js";
import { Message } from "../../../models/message-model.js";
import { findRoom } from "../room/find-room-service.js";

const MESSAGE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

// Store the chat message to the database
async function storeMessage(roomCode, userObjectId, msgContent, type) {
    try {
        // Check if the user exists in the database
        const user = await User.exists({ userObjectId });
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

export { storeMessage };