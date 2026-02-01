// room-selection-handler.js

// Set up the create and join room buttons, and obtain inputs from the user
async function receiveUserInputOnRoomSelection() {    
    // Get and return user input on room name, with an empty room code
    async function handleRoomCreationSelection() {
        const inputRoomName = document.getElementById("roomNameInSelection").value.trim();
        return { roomCode: "", roomName: inputRoomName };
    }

    // Get and return user input on room code, with an empty room name
    async function handleRoomJoinSelection() {
        const inputRoomCode = document.getElementById("roomCodeInSelection").value.trim();
        return { roomCode: inputRoomCode, roomName: "" };
    }

    return new Promise((resolve, reject) => {
        const createRoomBtn = document.getElementById("createRoomBtn");
        const joinRoomBtn = document.getElementById("joinRoomBtn");

        // Obtain room name from the user upon button clicking "create room"
        createRoomBtn.addEventListener("click", async () => {
            try {
                const result = await handleRoomCreationSelection();
                resolve(result.roomCode, result.roomName);
            } catch {
                reject(new Error("Error in room selection."));
            }
        }, { once: true });
        // Obtain room code from the user upon button clicking "join room"
        joinRoomBtn.addEventListener("click", async () => {
            try {
                const result = await handleRoomJoinSelection();
                resolve(result.roomCode, result.roomName);
            } catch {
                reject(new Error("Error in room selection."));
            }
        }, { once: true });
    });
}

// Send the create-room request along with the room name to the server
async function sendRoomNameToServer(socket, inputRoomName) {
    socket.emit("create room", inputRoomName);
    return
}

// Send the join-room request along with the room code to the server
async function sendRoomCodeToServer(socket, inputRoomCode) {
    socket.emit("join room", inputRoomCode);
    return
}

// Wait until receiving responses on room creation from server
async function waitingForServerResponseOnCreatingRoom(socket) {
    return new Promise((resolve, reject) => {
        // Wait for the server to send the room code; set room code if success
        socket.once("room-created", (roomCode, roomName) => {
            resolve({ roomCode: roomCode, roomName: roomName });         
        });

        // Report failure otherwise
        socket.once("room-create-failed", () => {
            reject({ roomCode: "", roomName: "" });
        });
    }); 
}

// Wait until receiving responses on room join from server
async function waitingForServerResponseOnJoiningRoom(socket) {
    return new Promise((resolve, reject) => {
        // Set room code to the inputted one if success
        socket.once("room-joined", (roomCode, roomName) => {
            resolve({ roomCode: roomCode, roomName: roomName });     
        });

        // Report failure otherwise
        socket.once("room-join-failed", () => {
            reject({ roomCode: "", roomName: "" });
        });
    }); 
}

export { receiveUserInputOnRoomSelection,
         sendRoomNameToServer,
         sendRoomCodeToServer,
         waitingForServerResponseOnCreatingRoom,
         waitingForServerResponseOnJoiningRoom};
