// authenticate-http.js

import { verifyToken } from "../utils/jwt-token-handler.js";
import { errorResponse } from "../utils/api-response.js";

// Authenticate the user for operations handled with http api endpoints
function authenticateHTTP(req, res, next) {
    // Try to get the JWT token from the requesting client's browser
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json(
            errorResponse(
                null,
                "Authentication required"
            )
        );
    } 

    try {
        const { userObjectId, userId } = verifyToken(token);
        req.user = {
            userObjectId,
            userId,
        };
        next();
        // console.log(`Authenticated user ${userId} for HTTP endpoints.`);
    } catch (err) {
        return res.status(401).json(
            errorResponse(
                null,
                "Invalid or expired token"
            )
        );
    }
}

export { authenticateHTTP };