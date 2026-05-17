// room-info-validator.js

// Returns true if room code is not empty; returns false otherwise
async function roomCodeIsNotEmpty(roomCode) {
    console.log("roomCode: ", roomCode)
    return roomCode !== "";
}

// Returns true if room name is not empty; returns false otherwise
async function roomNameIsNotEmpty(roomName) {
    console.log("roomName: ", roomName)
    return roomName !== "";
}

// Returns true if at least one field among room name and room code is true; returns false otherwise
async function roomInfoIsValid(roomCode, roomName) {
    const validness = (await roomCodeIsNotEmpty(roomCode)) || (await roomNameIsNotEmpty(roomName));
    console.log("Room info is valid: ", validness)
    return validness;
}

export default roomInfoIsValid;
