// message-retriever.js

import Message from "../models/message-model.js";

// Retrieve all the messages sent by the client from the database
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
