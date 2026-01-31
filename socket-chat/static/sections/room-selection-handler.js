// room-selection-handler.js

import showSection from "/static/utilities/section-renderer.js";

// Handle client create room selection
async function handleRoomCreationSelection(socket) {
    // Retrieve room name from user input
    const inputRoomName = document.getElementById("roomNameInSelection").value.trim();
    if (!inputRoomName) return;

    // Send the create-room request to the server
    socket.emit("create room", inputRoomName);
    return inputRoomName;
}

// Handle client join room selection
async function handleRoomJoinSelection(socket) {
    // Retrieve room code from user input
    const inputRoomCode = document.getElementById("roomCodeInSelection").value.trim();
    if (!inputRoomCode) return;

    // Send it to the server to check room existence
    socket.emit("join room", inputRoomCode);
    return inputRoomCode;
}

// Wait until receiving responses on room creation from server
async function waitingForServerResponseOnCreatingRoom(socket, inputRoomName) {
    return new Promise((resolve, reject) => {
        // Wait for the server to send the room code; set room code if success
        socket.once("room-created", (roomCode, roomName) => {
            resolve({ roomCode, roomName });         
        });

        // Report failure otherwise
        socket.once("room-create-failed", () => {
            reject(new Error(`Room creation failed. Room name: ${inputRoomName}`));
        });
    }); 
}

// Wait until receiving responses on room join from server
async function waitingForServerResponseOnJoiningRoom(socket, inputRoomCode) {
    return new Promise((resolve, reject) => {
        // Set room code to the inputted one if success
        socket.once("room-joined", (roomCode, roomName) => {
            resolve({ roomCode, roomName });     
        });

        // Report failure otherwise
        socket.once("room-join-failed", () => {
            reject(new Error(`Room join failed. Room code: ${inputRoomCode}`));
        });
    }); 
}

// Set up the create and join room buttons, and obtain inputs from the user
async function roomSelection(socket) {    
    return new Promise((resolve, reject) => {
        showSection("room");

        const createRoomBtn = document.getElementById("createRoomBtn");
        const joinRoomBtn = document.getElementById("joinRoomBtn");

        // Obtain room name from the user upon button click
        createRoomBtn.addEventListener("click", async () => {
            try {
                const inputRoomName = await handleRoomCreationSelection(socket);
                const { roomCode, roomName } = await waitingForServerResponseOnCreatingRoom(socket, inputRoomName);
                resolve({ roomCode, roomName });
            } catch {
                reject(new Error("Error in room selection."));
            }
        });
        // Obtain room code from the user upon button click
        joinRoomBtn.addEventListener("click", async () => {
            try {
                const inputRoomCode = await handleRoomJoinSelection(socket);
                const { roomCode, roomName } = await waitingForServerResponseOnJoiningRoom(socket, inputRoomCode);
                resolve({ roomCode, roomName });
            } catch {
                reject(new Error("Error in room selection."));
            }
        });
    });
}

export default roomSelection;
