// client.js

import setUpButtonClickWithEnterKey from "/public/utilities/button-click-setup.js";
import login from "/public/sections/login-handler.js";
import validateCredentials from "/public/utilities/credentials-validator.js";
import connect from "/public/sections/connection-handler.js";
import * as RoomSelectionServices from "/public/sections/room-selection-handler.js";
import roomInfoNotValid from "/public/utilities/room-info-validator.js";
import startSession from "/public/sections/session-handler.js";

async function start_client() {
    // Set up the page such that the button will be clicked 
    // upon user "Enter" key press on the corresponding form
    await setUpButtonClickWithEnterKey();
    
    // Handle user login credentials, and user connection (if authenticated)
    let credentials = null;
    do {
        credentials = await login();
    } while (await validateCredentials(credentials));

    // Obtain client socket after authenticating 
    const socket = await connect(credentials);

    // Get user input on room selection (create or join); repeat until either one is not empty
    // let inputRoomCode = "";
    // let inputRoomName = "";
    // do {
    //     const result = await RoomSelectionServices.receiveUserInputOnRoomSelection()
    //     inputRoomCode = result.roomCode;
    //     inputRoomName = result.roomName;
    //     console.log("inputRoomCode: ", inputRoomCode)
    //     console.log("inputRoomName: ", inputRoomName)
    // } while (!(await roomInfoNotValid(inputRoomCode, inputRoomName))); 

    // // Sent user input on room selection to server and wait for the response
    // let roomCode = "";
    // let roomName = "";
    // if (!inputRoomCode) {
    //     // Client chooses to create room
    //     // Send inputted room name to server
    //     await RoomSelectionServices.sendRoomNameToServer(socket, inputRoomName);
    //     // Receive response from server
    //     const result = await RoomSelectionServices.waitingForServerResponseOnCreatingRoom(socket);
    //     roomCode = result.roomCode;
    //     roomName = result.roomName;
    // } else if (!inputRoomName) {
    //     // Client chooses to join room,
    //     // Send inputted room code to server
    //     await RoomSelectionServices.sendRoomCodeToServer(socket, inputRoomCode);
    //     // Receive response from server
    //     const result = await RoomSelectionServices.waitingForServerResponseOnJoiningRoom(socket);
    //     roomCode = result.roomCode;
    //     roomName = result.roomName;
    // } else {
    //     console.error("Invalid room info: both room code and room name are empty");
    //     return;
    // }

    // Handle user chatting session
    // startSession(socket, roomCode, roomName);
}

start_client();
