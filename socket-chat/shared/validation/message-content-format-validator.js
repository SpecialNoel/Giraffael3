// message-content-format-validator.js

const CONTENT_MIN_LENGTH = 1;
const CONTENT_MAX_LENGTH = 2000;

// Check the validness of the format of the received message content
// Note: content should not be trimmed before or after validation
function validateMessageContentFormat(content) {
    // Type check
    if (typeof content !== "string") {
        return {
            success: false,
            message: "Message content must be of type string."
        };
    }

    // Min length check
    if (content.length < CONTENT_MIN_LENGTH) {
        return {
            success: false,
            message: `Message content must be at least ${CONTENT_MIN_LENGTH} characters long.`
        };
    }

    // Max length check
    if (content.length > CONTENT_MAX_LENGTH) {
        return {
            success: false,
            message: `Message content must not exceed ${CONTENT_MAX_LENGTH} characters long.`
        };
    }

    return {
        success: true,
        message: "Message content meets all requirements."
    }
}

export { validateMessageContentFormat };