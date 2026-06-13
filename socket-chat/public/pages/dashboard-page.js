// dashboard-page.js

import { handleDashboard, setupRoomsContainerRefresher } from "../services/dashboard-service.js";
import { sendTokenToServer, startSession } from "../services/socket-service.js";
import { appendRoomToRoomsContainer } from "../utils/rooms-container-handler.js";

// Create a socket and send the JWT token to server for authentication
const socket = await sendTokenToServer();

// Retrieve room info for rooms container, upon user refreshing the dashboard page
setupRoomsContainerRefresher()

// Handle user dashboard services
handleDashboard();

// Start the socket communication with server
startSession(socket);