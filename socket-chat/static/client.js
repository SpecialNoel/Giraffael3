// client.js

import login from "/static/login-handler.js";
import connect from "/static/connection-handler.js";
import roomSelection from "/static/room-selection-handler.js";
import startSession from "/static/session-handler.js";
import setUpButtonClickWithEnterKey from "./button-click-setup.js";

async function start_client() {
    // Set up the page such that the button will be clicked 
    // upon user "Enter" key press on the corresponding form
    await setUpButtonClickWithEnterKey();
    
    // Handle user login credentials, and user connection (if authenticated)
    const credentials = await login();

    // Obtain client socket after authenticating 
    const socket = await connect(credentials);

    // Handle user room selection (create or join)
    const { roomCode, roomName } = await roomSelection(socket);

    // Handle user chatting session
    startSession(socket, roomCode, roomName);
}

start_client();
