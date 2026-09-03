// authenticate-socket.js

import { verifyToken } from "../../utils/jwt-token-handler.js";
import { User } from "../../models/user-model.js";

// Authenticate the user for operations handled with socket events
async function authenticateSocket(token, socket, next) {
    try {
        // Verify the received token to ensure its validity
        const { userObjectId, userId } = verifyToken(token);

        // Fetch the username of this user (which should already exists as userObjectId exists)
        const user = await User.findById(userObjectId).select("username");
        if (!user) return next(new Error("User not found"))

        // Apply received user info inside the token for later use
        socket.user = {
            userObjectId: userObjectId,
            username: user.username,
            userId: userId,
        };
        
        // "next()" continues the connection by invocating "io.on("connection")"
        next();
    } catch (err) {
        console.log("Error in authenticating user");

        // "next(new Error())" rejects the connection
        next(new Error("Authentication failed"));
    }
}

export { authenticateSocket };