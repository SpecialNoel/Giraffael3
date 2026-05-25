// message-services.js

import Message from "../models/message-model.js";
import Room from "../models/room-model.js";
import User from "../models/user-model.js";

// Store the chat message sent by a client to the database
async function storeMessage(roomId, senderId, content) {
    try {
        const room = await Room.findById(roomId); // Find room based on _id
        const sender = await User.findOne({ userId: senderId });

        const expiringDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        const newMessage = new Message({
            room: room,
            sender: sender,
            content: content,
            expireAt: expiringDate
        });

        const savedMessage = await newMessage.save();
        console.log("Message saved to DB\n");
        return savedMessage;
    } catch (error) {
        console.error("Error in storing message to DB:", error);
        throw error;
    }
}

// Retrieve all the messages sent by the client from the database
async function findMessagesByUserId(senderId) {
    try {
        const messages = await Message.find({
            senderId: senderId
        });
        
        return messages;
    } catch (error) {
        console.error("Error in retrieving message from DB:", error);
        throw error;
    }
}

export { storeMessage, findMessagesByUserId };
