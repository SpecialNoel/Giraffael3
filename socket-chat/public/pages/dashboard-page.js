// dashboard-page.js

import { handleDashboard, setupRoomsContainerRefresher } from "../services/dashboard-service.js";
import { sendTokenToServer, startSession } from "../services/socket-service.js";

// Handle user dashboard services (HTTP endpoints operations)
handleDashboard();

// Refresh the rooms container upon user refreshing the dashboard page (HTTP endpoints operations)
setupRoomsContainerRefresher();

/* 
 * Create a socket and send the JWT token to server for authentication for socket events.
 * This step needs to be done first for the server to authenticate the client.
 * Once the client is authenticated (i.e. is trusted by server), server can
 *   use client information such as _id and userId directly without the client
 *   send these information to server for each HTTP API endpoint operation and 
 *   other operations.
 * TLDR: token verification comes after user sign-in, but before every other 
 *       dashboard services.
*/
const socket = await sendTokenToServer();

// Start socket communication with server with the created socket
startSession(socket);