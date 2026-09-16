// authenticate-socket.js

import { verifyAccessToken } from "../../../utils/jwt-token-handler.js";
import { User } from "../../../models/user-model.js";

// Authenticate the user for operations handled with socket events
async function authenticateSocket(accessToken, socket, next) {
    try {
        // Verify the received accessToken to ensure its validity while obtaining client info stored inside
        const { userObjectId, userId } = verifyAccessToken(accessToken);

        // Fetch the username of this user (which should already exists as userObjectId exists)
        const user = await User.findById(userObjectId).select("username");
        if (!user) return next(new Error("User not found"));

        // Apply received user info inside the accessToken for later use
        socket.user = {
            userObjectId: userObjectId,
            username: user.username,
            userId: userId,
        };
        
        // "next()" continues the connection by invocating "io.on("connection")"
        next();
    } catch (err) {
        console.log("Error in authenticating user:", err);

        // "next(new Error())" rejects the connection (i.e. reject the promise on client side connectSocket())
        if (err.name === "TokenExpiredError") {
            return next(new Error("Access token expired"));
        }
        return next(new Error("Authentication failed"));
    }
}

export { authenticateSocket };