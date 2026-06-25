// message-view.js

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

export { appendMessageToChatList, markMessageFailed, markMessageSent };