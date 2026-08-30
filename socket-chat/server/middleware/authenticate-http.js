// authenticate-http.js

import { verifyToken } from "../utils/jwt-token-handler.js";
import { errorResponse } from "../utils/api-response.js";

// Authenticate the user for operations handled with http api endpoints
function authenticateHTTP(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json(
                errorResponse(
                    null,
                    "Missing token"
                )
            );
        }

        const token = authHeader.split(" ")[1];

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
                "Invalid token"
            )
        );
    }
}

export { authenticateHTTP };