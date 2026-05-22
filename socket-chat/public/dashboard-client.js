// dashboard-client.js

import connect from "/sections/connection-handler.js";
import * as RoomSelectionServices from "/sections/room-selection-handler.js";
import roomInfoNotValid from "/utilities/room-info-validator.js";
import startSession from "/sections/session-handler.js";

async function handle_dashboard() {
    // Handle user dashboard services, including friend list, chatroom list, and setting management,
    // and the main panel as chatroom

    // Obtain client socket after authenticating 
    const username = localStorage.getItem("username");
    const socket = await connect(username);
    console.log("Connected to server.");

    // Get user input on room selection (create or join); repeat until either one is not empty
    let inputRoomCode = "";
    let inputRoomName = "";
    do {
        const result = await RoomSelectionServices.receiveUserInputOnRoomSelection()
        inputRoomCode = result.roomCode;
        inputRoomName = result.roomName;
        console.log("inputRoomCode: ", inputRoomCode)
        console.log("inputRoomName: ", inputRoomName)
    } while (await roomInfoNotValid(inputRoomCode, inputRoomName)); 

    // Sent user input on room selection to server and wait for the response
    let roomCode = "";
    let roomName = "";
    if (!inputRoomCode) {
        // Client chooses to create room
        // Send inputted room name to server
        await RoomSelectionServices.sendRoomNameToServer(socket, inputRoomName);
        // Receive response from server
        const result = await RoomSelectionServices.waitingForServerResponseOnCreatingRoom(socket);
        roomCode = result.roomCode;
        roomName = result.roomName;
    } else if (!inputRoomName) {
        // Client chooses to join room,
        // Send inputted room code to server
        await RoomSelectionServices.sendRoomCodeToServer(socket, inputRoomCode);
        // Receive response from server
        const result = await RoomSelectionServices.waitingForServerResponseOnJoiningRoom(socket);
        roomCode = result.roomCode;
        roomName = result.roomName;
    } else {
        console.error("Invalid room info: both room code and room name are both provided.");
        return;
    }

    // Handle user chatting session
    startSession(socket, roomCode, roomName);
}

handle_dashboard();
