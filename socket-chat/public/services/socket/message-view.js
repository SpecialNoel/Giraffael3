// message-view.js

// Append the message to the message list
function appendMessageToChatList(conversationElement, tmpId, content, status) {
    // Each message contains two parts: content and status
    const msgElement = document.createElement("li");
    msgElement.classList.add("message");
    msgElement.classList.add(status); // should be either "sending", or "failed"
    msgElement.dataset.id = tmpId; // this can be accessed with `data-id="${tmpId}"`

    // Content: basically the value of content
    const contentElement = document.createElement("span");
    contentElement.classList.add("content");
    contentElement.textContent = content;

    // Status: the verbal explanation on the status of the message 
    const statusElement = document.createElement("span");
    statusElement.classList.add("status");
    switch (status) {
        case "sending":
            statusElement.textContent = " - Sending...";
            break;
        case "failed":
            statusElement.textContent = " - Failed to send";
            break;
        default: 
            statusElement.textContent = " - Error";
    }

    // Append the components to the message element
    msgElement.appendChild(contentElement);
    msgElement.appendChild(statusElement);

    // Append the message element to the chat list element
    conversationElement.appendChild(msgElement);
    
    // Scroll the conversation to the very bottom
    conversationElement.scrollTop = conversationElement.scrollHeight;
}

// Update the UI upon failing to send the message (indicated by tmpId)
function markMessageFailed(tmpId) {
    // Fetch the target message
    const msgElement = document.querySelector(`[data-id="${tmpId}"]`);
    if (!msgElement) return;

    // Update the message
    msgElement.classList.add("failed");

    // Update the status of the message
    const statusElement = msgElement.querySelector(".status");
    if (statusElement) statusElement.textContent = " - Failed to send";
}

// Update the UI upon successfully sending the message (indicated by tmpId)
function markMessageSent(tmpId, content, _id) {
    // Fetch the target message
    const msgElement = document.querySelector(`[data-id="${tmpId}"]`);
    if (!msgElement) return;

    // Update the message
    msgElement.dataset.id = _id;
    msgElement.classList.remove("sending");
    msgElement.classList.add("sent");

    // Fetch username from local storage
    const username = localStorage.getItem("username");

    // Update the message directly on the UI of conversation
    msgElement.textContent = `[${username}]: ${content}`;
}

export { appendMessageToChatList, markMessageFailed, markMessageSent };