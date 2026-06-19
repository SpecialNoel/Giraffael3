// socket-service.js

// Create a socket and send the JWT token to server for authentication using the socket
function createAuthenticatedSocket() {
    const token = localStorage.getItem("token");
    const socket = io({
        auth: { token }
    });

    return new Promise((resolve, reject) => {
        // Connect the socket to server
        socket.once("connect", () => {
            console.log("Socket connected");

            // Receive response on token authentication
            console.log("Socket authenticated");

            // Return this authenticated socket
            resolve(socket);
        });

        // Server side triggered "next(new Error())"
        socket.once("connect_error", reject);
    });
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

// Append the message to the chat list (messagesElement)
function appendMessageToChatList(messagesElement, tmpId, userId, msgContent, status) {
    // Each message contains two parts: content and status
    const msgElement = document.createElement("div");
    msgElement.classList.add("message");
    msgElement.classList.add(status); // should be either "sending", "sent" or "failed"
    msgElement.dataset.id = tmpId; // this can be accessed with `data-id="${tmpId}"`

    // Content is basically the value of msgContent
    const contentElement = document.createElement("span");
    contentElement.classList.add("content");
    contentElement.textContent = msgContent;

    // Status is the verbal explanation on the status of the message 
    const statusElement = document.createElement("span");
    statusElement.classList.add("status");
    if (msgContent.status === "sending") {
        statusElement.textContent = "Sending...";
    } else if (msgContent.status === "sent") {
        statusElement.textContent = "Sent";
    } else if (msgContent.status === "failed") {
        statusElement.textContent = "Failed to send";
    }

    // Append the components to the message element
    msgElement.appendChild(contentElement);
    msgElement.appendChild(statusElement);

    // Append the message element to the chat list element
    messagesElement.appendChild(msgElement);
    
    // Scroll the page instantly to the very bottom
    window.scrollTo(0, document.body.scrollHeight);
}

// Update the UI upon failing to send the message (indicated by tmpId)
function markMessageFailed(tmpId) {
    // Fetch the target message
    const msgElement = document.querySelector(`[data-id="${tmpId}"]`);
    if (!msgElement) return;

    // Update the message
    msgElement.classList.add("failed");
    msgElement.querySelector(".status").textContent = "Failed to send";
}

// Update the UI upon successfully sending the message (indicated by tmpId)
function markMessageSent(tmpId, _id) {
    // Fetch the target message
    const msgElement = document.querySelector(`[data-id="${tmpId}"]`);
    if (!msgElement) return;

    // Update the message
    msgElement.dataset.id = _id;
    msgElement.classList.remove("sending");
    msgElement.classList.add("sent");

    // Update the status of the message
    const statusElement = msgElement.querySelector(".status");
    if (statusElement) statusElement.textContent = "Sent";
}

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

// Handle socket communication with server
function startSession(socket) {
    function updateBasicGui(roomCode, roomName, userId) {
        // Update code and name of the room, as well as user info, on user GUI
        const roomCodeInChatElement = document.getElementById("roomCodeInChat");
        if (roomCodeInChatElement) roomCodeInChatElement.textContent = `Room code: ${roomCode}`;

        const titleElement = document.getElementById("title");
        if (titleElement)titleElement.textContent = roomName;

        const userIdInChatElement = document.getElementById("userIdInChat");
        if (userIdInChatElement) userIdInChatElement.textContent = `User Id: ${userId}`;
    }

    const roomCode = "default_roomCode";
    const roomName = "default_roomName";
    const userId = localStorage.getItem("userId");
    updateBasicGui(roomCode, roomName, userId);
    
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const messagesElement = document.getElementById("messages");
    const onlineUsersElement = document.getElementById("onlineUsers");

    // Upon form submission, send the input message (if any) to the server
    form.addEventListener("submit", (e) => {
        // Prevent web page reloading upon form submission
        e.preventDefault();
        handleSendMessage(
            userId,
            messagesElement,
            input,
            socket,
        );
    });

    // Handle update on online users list upon user joining or leaving the room
    socket.on("userJoined", (onlineUsers) => {
        updateOnlineUserList(onlineUsersElement, onlineUsers);
    });
    socket.on("userLeft", (onlineUsers) => {
        updateOnlineUserList(onlineUsersElement, onlineUsers);
    });

    socket.on("userEntered", ({ members, messages }) => {
        // TODO: Update the dashboard UI

        // members is a list of { userId, username }
        console.log("Members: ");
        members.forEach(member => {
            console.log(`${member.username}: [${member.userId}]`);
        });

        // messages is a list of Message documents
        console.log("\nMessages: ");
        // members.map(member => (
        //     <div key={member.userId}>
        //         {member.username}
        //     </div>
        // ));
    });

    // Handle client socket receiving chat messages sent by connected clients
    socket.on("chatMessageReceived", (senderId, msgContent) => {
        appendMessageToChatList(messagesElement, senderId, msgContent);
    });

    // Handle room deletion event
    socket.on("roomDeleted", ({ roomCode, msg }) => {
        alert(msg);
        console.log(`Room ${roomCode} has been deleted.`)        
        // Navigate to the dashboard after receiving the room deletion notification
        window.location.href = "/dashboard";
    });
}

export { createAuthenticatedSocket, startSession };