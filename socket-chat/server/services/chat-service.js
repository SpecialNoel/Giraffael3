// chat-service.js

import { storeMessage } from "../services/db-services/message/store-message-service.js";

async function storeUserMessage(roomCode, userObjectId, msgContent) {
    // Store the message to MongoDB
    return await storeMessage(roomCode, userObjectId, msgContent, "text");
}

export { storeUserMessage };