// message-services.js

import { generateTemporaryId } from "../utils/tmp-id-generator.js";
import { appendMessageToMessageList, 
         markMessageAsFailed, 
         markMessageAsSent } from "./message-view.js";
import { getRoomCodeFromParams } from "../dashboard/conversation/services.js";
import { storeMessageToState } from "../dashboard/conversation/enter-room-services.js";

// Send the input message to server (for which server will then relay to other active users in the room)
function sendMessage(userId, conversationElement, inputElement, socket) {
    // Stop proceeding if user somehow passed an empty message (as this should be handled by form's "required" attribute already)
    if (!inputElement.value) return;

    const content = inputElement.value;
    const tmpId = generateTemporaryId();

    // Step 1: Append user message directly to the chat list (before receiving server confirmation on storing the message to database)
    appendMessageToMessageList(conversationElement, tmpId, content, "sending");
    inputElement.value = ""; // clear the message input field

    // Step 2: Emit the chat message to server, with a 5-second timeout
    // This reaches the same functionality as "emiWithAck()"
    socket.timeout(5000).emit("chatMessage", { content, tmpId }, (err, res) => {
        // Receive server response and update the appended message based on the response
        console.log("res.status:", res.status);

        // Step 2.5: Update the message if the message transmission results in failure
        if (err || res.status !== "success") {
            markMessageAsFailed(tmpId);
            console.log("Server did not acknowledge the transmission of this chat message in the given delay.");
            return;
        }

        // Step 3: Update the message with its id piggybacked from server after successfully sent the message
        markMessageAsSent(tmpId, content, res.message._id);
        console.log(`Server acknowledgement: ${res.status}`);

        // Step 4: Update the message list in the dashboard state
        const roomCode = getRoomCodeFromParams();
        const username = localStorage.getItem("username");
        const message = { username, content }
        storeMessageToState(roomCode, message);
    });
}

export { sendMessage };