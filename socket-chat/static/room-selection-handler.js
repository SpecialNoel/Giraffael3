// room-selection-handler.js

import showSection from "/static/section-renderer.js";

let roomCode = null;
let roomName = null;

function setRoomCode(roomCode) { 
    roomCode = roomCode;
}
function getRoomCode() {
    if (!roomCode) throw new Error("Room code not set yet");
    return roomCode;
}

function setRoomName(roomName) { 
    roomName = roomName;
}
function getRoomName() {
    if (!roomName) throw new Error("Room name not set yet");
    return roomName;
}

// Handle client create room selection
async function handleRoomCreationSelection(socket) {
    // Retrieve room name from user input
    const inputRoomName = document.getElementById("roomNameInSelection").value.trim();
    if (!inputRoomName) return;

    console.log(`Inputted room name: ${inputRoomName}`)

    // Send the create-room request to the server
    socket.emit("create room", inputRoomName);

    // Wait for the server to send the room code; set room code if success
    socket.once("room-created", (roomCode, roomName) => {
        setRoomCode(roomCode);
        setRoomName(roomName);
    });

    // Report failure otherwise
    socket.once("room-create-failed", () => {
        throw new Error(`Room creation failed. Room name: ${inputRoomName}`);
    });
}

// Handle client join room selection
async function handleRoomJoinSelection(socket) {
    // Retrieve room code from user input
    const inputRoomCode = document.getElementById("roomCodeInSelection").value.trim();
    if (!inputRoomCode) return;

    // Send it to the server to check room existence
    socket.emit("join room", inputRoomCode);

    // Set room code to the inputted one if success
    socket.once("room-joined", (roomCode, roomName) => {
        setRoomCode(roomCode);
        setRoomName(roomName);
    });

    // Report inputted room code invalidness to user otherwise
    socket.once("room-join-failed", () => {
        throw new Error(`Room join failed. Room code: ${inputRoomCode}`);
    });
}

// Set up the create and join room buttons, and obtain inputs from the user
async function roomSelection(socket) {    
    return new Promise((resolve, reject) => {
        showSection("room");

        const createRoomBtn = document.getElementById("createRoomBtn");
        const joinRoomBtn = document.getElementById("joinRoomBtn");

        // Click the button upon user hitting the "Enter" key when filling the fields
        document.getElementById("roomNameInSelection").addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                createRoomBtn.click();
            }
        });
        document.getElementById("roomCodeInSelection").addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                joinRoomBtn.click();
            }
        });

        // Obtain room code from the user upon button clicks
        createRoomBtn.addEventListener("click", async () => {
            await handleRoomCreationSelection(socket);
            if (!roomCode) reject;
            resolve(roomCode);
        });
        joinRoomBtn.addEventListener("click", async () => {
            await handleRoomJoinSelection(socket);
            if (!roomCode) reject;
            resolve(roomCode);
        });
    });
}

export { roomSelection, getRoomCode };
