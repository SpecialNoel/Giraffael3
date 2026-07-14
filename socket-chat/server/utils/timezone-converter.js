// timezone-converter.js

// Convert the timestamp of the message into NY timezone for readability
function getMessageWithNYTimezone(message) {
    const sender = message.sender;
    const content = message.content;
    
    const createdAtTimestamp = message.createdAt;
    const nyCreatedAtTimestamp = createdAtTimestamp.toLocaleString("en-US", {
        timeZone: "America/New_York"
    });
    const expiresAtTimestamp = message.expiresAt;
    const nyExpiresAtTimestamp = expiresAtTimestamp.toLocaleString("en-US", {
        timeZone: "America/New_York"
    });

    // Note that convertedMessage is only for readability purpose (i.e. it
    // is not really a message, and it does not follow the "Message" model)
    const convertedMessage = {
        sender: sender,
        content: content,
        createdAt: nyCreatedAtTimestamp,
        expiresAt: nyExpiresAtTimestamp
    };
    return convertedMessage;
}

export { getMessageWithNYTimezone };
