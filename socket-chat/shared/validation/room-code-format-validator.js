// room-code-format-validator.js

const ROOM_CODE_PATTERN = /^[A-HJ-NP-Z2-9]+$/;
const ROOM_CODE_LENGTH = 8;

// Check the validness of the format of the received room code
// Note: trim roomCode before validation
function validateRoomCodeFormat(roomCode) {
    // Type check
    if (typeof roomCode !== "string") {
        return {
            success: false,
            message: "Room code must be of type string."
        };
    }

    // Length check
    if (roomCode.length !== ROOM_CODE_LENGTH) {
        return {
            success: false,
            message: `Room code must be ${ROOM_CODE_LENGTH} characters long.`
        };
    }

    // Regex check
    if (!(ROOM_CODE_PATTERN.test(roomCode))) {
        return {
            success: false,
            message: "Room code can only contain capitalized alphabets and numbers, excluding '1', 'I', '0', and 'O'."
        };    
    }

    return {
        success: true,
        message: "Room code meets all requirements."
    }
}

export { validateRoomCodeFormat };