// message-timezone-converter.js

// Convert the timestamp of the message into NY timezone for readability
function getMessageWithNYTimezone(message) {
    const senderId = message.senderId;
    const username = message.username;
    const text = message.text;
    
    const createdAtTimestamp = message.createdAt;
    const nyCreatedAtTimestamp = createdAtTimestamp.toLocaleString("en-US", {
        timeZone: "America/New_York"
    });
    const expireAtTimestamp = message.expireAt;
    const nyExpireAtTimestamp = expireAtTimestamp.toLocaleString("en-US", {
        timeZone: "America/New_York"
    });

    const convertedMessage = {
        senderId: senderId,
        username: username,
        text: text,
        createdAt: nyCreatedAtTimestamp,
        expireAt: nyExpireAtTimestamp
    };
    return convertedMessage;
}

export default getMessageWithNYTimezone;
