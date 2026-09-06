// room-name-format-validator.js

const ROOM_NAME_MIN_LENGTH = 1;
const ROOM_NAME_MAX_LENGTH = 50;
const ROOM_NAME_PATTERN = /^[a-zA-Z0-9 _-]+$/;

// Check the validness of the format of the received room name
// Note: trim roomName before validation
function validateRoomNameFormat(roomName) {
    // Type check
    if (typeof roomName !== "string") {
        return {
            success: false,
            message: "Room name must be of type string."
        };
    }

    // Min length check
    if (roomName.length < ROOM_NAME_MIN_LENGTH) {
        return {
            success: false,
            message: `Room name must be at least ${ROOM_NAME_MIN_LENGTH} characters long.`
        };
    }

    // Max length check
    if (roomName.length > ROOM_NAME_MAX_LENGTH) {
        return {
            success: false,
            message: `Room name must not exceed ${ROOM_NAME_MAX_LENGTH} characters long.`
        };    
    }

    // Regex check
    if (!(ROOM_NAME_PATTERN.test(roomName))) {
        return {
            success: false,
            message: "Room name can only contain letters, numbers, spaces, - and _."
        };    
    }

    return {
        success: true,
        message: "Room name meets all requirements."
    }
}

export { validateRoomNameFormat };