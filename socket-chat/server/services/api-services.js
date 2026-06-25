// api-services.js

import { verifyToken } from "../utils/jwt-token-handler.js";

// Authenticate the user for operations handled with http api endpoints
function authenticateForHTTPEndpoints(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing token",
            });
        }

        const token = authHeader.split(" ")[1];

        const { _id, userId } = verifyToken(token);

        req.user = {
            _id,
            userId,
        };

        next();
        // console.log(`Authenticated user ${userId} for HTTP endpoints.`);
    } catch (err) {
        return res.status(401).json({
            error: "Invalid token",
        });
    }
}

export { authenticateForHTTPEndpoints };