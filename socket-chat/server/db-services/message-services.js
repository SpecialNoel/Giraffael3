// message-services.js

import Message from "../models/message-model.js";
import Room from "../models/room-model.js";
import User from "../models/user-model.js";

const MESSAGE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

// Store the chat message to the database
async function storeMessage(roomId, senderId, content) {
    try {
        // Check if the user exists in the database
        const user = await User.findById(senderId);
        if (!user) throw new Error("Sender not found");

        // Auto-delete this message 1 hour after creation
        const expireAt = new Date(Date.now() + MESSAGE_EXPIRATION_MS);

        // Construct and store the message using the Message model
        const message = await Message.create({
            room: roomId,
            sender: senderId,
            content,
            expireAt
        });
        console.log("Message saved to DB\n");
        return message;
    } catch (error) {
        console.error("Failed to store message:", error);
        throw error;
    }
}

// Retrieve all the messages sent by the user from the database
async function findMessagesByUserId(senderId) {
    try {
        // Find the sent messages based on user _id
        return await Message.find({ sender: senderId });
    } catch (error) {
        console.error("Failed to retrieve messages:", error);
        throw error;
    }
}

export { storeMessage, findMessagesByUserId };
