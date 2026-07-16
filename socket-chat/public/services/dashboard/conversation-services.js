// conversation-services.js

// Render the whole conversation in the room on Dashboard page UI
function renderConversation(conversationElement, conversation) {
    // Empty the current conversation first
    conversationElement.innerHTML = "";

    // For each message that was sent over the room, add info about the message to the conversation
    conversation.forEach(({ messageObjectId, userId, username, content, type }) => {
        const item = document.createElement("li");
        item.textContent = `[${username}]: ${content}`;
        conversationElement.appendChild(item);
        // Scroll the browser window to the bottom of the conversation element
        conversationElement.scrollTop = conversationElement.scrollHeight;
    });
}

// Load some latest messages of the whole conversation in the room on Dashboard page UI
function loadInitConversation(conversationElement, amount=5) {

}

// Append the message received from other users in the room to the existing conversation
function appendMessage(conversationElement, content, senderUsername) {
    // Append the message to the conversation
    const item = document.createElement("li");
    item.textContent = `[${senderUsername}]: ${content}`;
    conversationElement.appendChild(item);
    // Scroll the browser window to the bottom of the conversation element
    conversationElement.scrollTop = conversationElement.scrollHeight;
}

// Prepend some older messages of the whole conversation on top of existing messages
function prependMessages(amount=5) {
    console.log("Hi, you just prepended some msg")
}

// Remove expired message from conversation UI
function removeMessage() {

}

export { renderConversation, 
         loadInitConversation,
         appendMessage,
         prependMessages,
         removeMessage };