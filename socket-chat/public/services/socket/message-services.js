// message-services.js

import { appendMessageToChatList, 
         markMessageFailed, 
         markMessageSent } from "./message-view.js";

// Send the input message to server (for which server will then relay to other online users in the room)
function handleSendMessage(userId, messagesElement, input, socket) {
    // Stop proceeding if user somehow passed an empty message (as this should be handled by form's "required" attribute already)
    if (!input.value) return;

    const msgContent = input.value;
    const tmpId = crypto.randomUUID();

    // Step 1: Append user message directly to the chat list
    appendMessageToChatList(messagesElement, tmpId, userId, msgContent, "sending");
    input.value = "";

    // Step 2: Emit the chat message to server, with a 5-second timeout
    // This reaches the same functionality as "emiWithAck()"
    socket.timeout(5000).emit("chatMessage", { msgContent, tmpId }, (err, res) => {
        // Receive server response and update the appended message based on the response
        console.log("res.status:", res.status);
        if (err || res.status !== "success") {
            // Update the message if the message transmission results in failure
            markMessageFailed(tmpId);
            console.log("Server did not acknowledge the transmission of this chat message in the given delay.");
            return;
        }

        // Step 3: Update the message with its id piggybacked from server after successfully sent the message
        markMessageSent(tmpId, res.message._id);
        console.log(`Server acknowledgement: ${res.status}`);
    });
}

export { handleSendMessage };