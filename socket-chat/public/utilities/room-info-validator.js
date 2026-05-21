// room-info-validator.js

// Returns true if room code is not empty; returns false otherwise
async function roomCodeIsNotEmpty(roomCode) {
    return roomCode !== "";
}

// Returns true if room name is not empty; returns false otherwise
async function roomNameIsNotEmpty(roomName) {
    return roomName !== "";
}

// Returns true if at least one field among room name and room code is no empty; returns false otherwise
async function roomInfoIsValid(roomCode, roomName) {
    return (await roomCodeIsNotEmpty(roomCode)) || (await roomNameIsNotEmpty(roomName));
}

export default roomInfoIsValid;
