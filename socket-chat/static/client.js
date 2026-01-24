// client.js

import login from "/static/login-handler.js";
import { connect } from "/static/connection-handler.js";
import { roomSelection } from "/static/room-selection-handler.js";
import startSession from "/static/session-handler.js";

async function start_client() {
    // Handle user login credentials, and user connection (if authenticated)
    const credentials = await login();

    // Obtain client socket after authenticating 
    const socket = await connect(credentials);

    // Handle user room selection (create or join)
    const roomCode = await roomSelection(socket);

    // Handle user chatting session
    startSession(socket, roomCode);
}

start_client();
