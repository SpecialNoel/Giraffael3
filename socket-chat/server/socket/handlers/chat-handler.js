// chat-handler.js

import { broadcastChatMessage } from "../emitters/room-broadcaster.js";
import { storeTextMessage } from "../../services/db-services/message/store-message-service.js";

async function registerChatHandler(socket, tmpId, content, callback) {
    // Handle the chat message event
    try {
        // If somehow the server received a message the user sent while the user is not currently inside a room,
        // abandon the received message
        if (!socket.activeRoomCode) {
            console.log("Received a message from user while they are not inside a room yet");
            // Alert the user that they are currently not in a room
            socket.emit("messageRejectedNoActiveRoom");
            callback({
                status: "error" // return "error" (i.e. not success) back to client
            });       
            return;
        }

        // Notify the room about the message
        broadcastChatMessage(socket, socket.activeRoomCode, tmpId, content);

        console.log(`Received a message from SocketID: ${socket.id}`);

        // Store the chat message to the database
        const message = await storeTextMessage(socket.activeRoomCode, 
                                               socket.user.userObjectId, 
                                               content,
                                               "text");

        // The callback function will be called to mark the acknowledgement from server on this event
        callback({
            status: "success", // return "success" back to client to make them update the status of the message
            tmpId, // piggyback the tmpId received from client
            message
        });
    } catch (err) {
        callback({
            status: "error" // return "error" (i.e. not success) back to client
        });        
    }
};

export { registerChatHandler };