// room-info-validator.js

// Returns true if room code is empty; returns false otherwise
async function checkRoomCodeEmptiness(roomCode) {
    console.log(`Room code: ${roomCode}`);
    return roomCode === "";
}

// Returns true if room name is empty; returns false otherwise
async function checkRoomNameEmptiness(roomName) {
    console.log(`Room name: ${roomName}`);
    return roomName === "";
}

// Returns true if either room code or room name or both are empty; returns false otherwise
async function validateRoomInfo(roomCode, roomName) {
    return (await checkRoomCodeEmptiness(roomCode)) && (await checkRoomNameEmptiness(roomName));
}

export default validateRoomInfo;
