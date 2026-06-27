// authenticate-socket.js

import { verifyToken } from "../utils/jwt-token-handler.js";

// Authenticate the user for operations handled with socket events
function authenticateSocket(socket, next) {
    try {
        // Receive JWT token from user (one time only)
        const token = socket.handshake.auth.token;

        // Verify the received token to ensure its validity
        const { userObjectId, userId } = verifyToken(token);
        // Apply received user info inside the token for later use
        socket.user = {
            userObjectId: userObjectId,
            userId: userId,
        };
        console.log(`Authenticated user ${userId} for socket events.`);

        // "next()" continues the connection by invocating "io.on("connection")"
        next();
    } catch (err) {
        console.log("Error in authenticating user");

        // "next(new Error())" rejects the connection
        next(new Error("Authentication failed"));
    }
}

export { authenticateSocket };