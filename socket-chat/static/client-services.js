// client-services.js

// Append the message to the chat list
function appendMessageToChatList(username, messagesElement, msg) {
    const item = document.createElement("li");
    item.textContent = username + ": " + msg;
    messagesElement.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

// Update the current online users in the room
function updateOnlineUserList(onlineUsersElement, onlineUsers) {
    onlineUsersElement.innerHTML = "";
    onlineUsers.forEach((userId) => {
        const item = document.createElement("li");
        item.textContent = userId;
        onlineUsersElement.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}

// Send the input message to server (for which server will then relay to other online users in the room)
function handleSendMessage(username, messagesElement, input, socket) {
    if (input.value) {
        // Emit the chat message to server, with a 5-second timeout
        // This reaches the same functionality as "emiWithAck()"
        socket.timeout(5000).emit("chat message", username, input.value, (err, res) => {
        if (err) {
            console.log(
            "Server did not acknowledge the transmission of this chat message in the given delay.",
            );
        } else {
            console.log(`Server acknowledgement: ${res.status}`);
        }
        });
        
        // Append client message directly to the chat list
        appendMessageToChatList(username, messagesElement, input.value);
        input.value = "";
    }
}
    
export { appendMessageToChatList, 
         updateOnlineUserList, 
         handleSendMessage }
