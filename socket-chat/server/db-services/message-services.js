// message-services.js

import Message from "../models/message-model.js";
import Room from "../models/room-model.js";
import User from "../models/user-model.js";

const MESSAGE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

// Store the chat message to the database
async function storeMessage(roomId, senderId, content) {
    try {
        // Auto-delete this message 1 hour after creation
        const expireAt = new Date(Date.now() + MESSAGE_EXPIRATION_MS);

        // Construct the message using the Message model
        const newMessage = new Message({
            room: roomId,
            sender: senderId,
            content,
            expireAt
        });

        // Save the message to the message collection
        const savedMessage = await newMessage.save();
        console.log("Message saved to DB\n");
        return savedMessage;
    } catch (error) {
        console.error("Failed to store message:", error);
        throw error;
    }
}

// Retrieve all the messages sent by the user from the database
async function findMessagesByUserId(senderId) {
    try {
        // Find the sent messages based on user _id
        const messages = await Message.find({ sender: senderId });
        return await Message.findById(senderId);
    } catch (error) {
        console.error("Failed to retrieve messages:", error);
        throw error;
    }
}

export { storeMessage, findMessagesByUserId };
