// chat-service.js

import { storeMessage } from "../services/db-services/message/store-message-service.js";

async function storeUserMessage(roomCode, userObjectId, content) {
    // Store the message to MongoDB
    return await storeMessage(roomCode, userObjectId, content, "text");
}

export { storeUserMessage };