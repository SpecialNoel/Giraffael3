// message-saver.js

import Message from "../models/message-model.js";

async function storeMessage(senderId, username, messageText) {
    try {
        const expiringDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        const newMessage = new Message({
            senderId: senderId,
            username: username,
            text: messageText,
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

export default storeMessage;
