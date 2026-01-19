// message-retriever.js

import Message from "../models/message-model.js";

async function retrieveMessagesByUserId(senderId) {
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

export default retrieveMessagesByUserId;
