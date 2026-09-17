// authenticate-http.js

import { verifyAccessToken } from "../utils/jwt-token-handler.js";
import { errorResponse } from "../utils/api-response.js";

// Authenticate the user for operations handled with http api endpoints
function authenticateHTTP(req, res, next) {
    // Try to get the accessToken from the requesting client's browser
    const accessToken = req.cookies.accessToken;
    console.log("access in authenticateHTTP:", accessToken.substring(0, 10));

    if (!accessToken) {
        console.log("Authentication required");
        return res.status(401).json(
            errorResponse(
                null,
                "Authentication required"
            )
        );
    } 

    try {
        const { userObjectId, userId } = verifyAccessToken(accessToken);
        req.user = {
            userObjectId,
            userId,
        };
        next();
        // console.log(`Authenticated user ${userId} for HTTP endpoints.`);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            console.log("Access token expired");
            return res.status(401).json(
                errorResponse(
                    null,
                    "Access token expired"
                )
            );
        }

        console.log("Invalid token expired");
        return res.status(401).json(
            errorResponse(
                null,
                "Invalid access token"
            )
        );
    }
}

export { authenticateHTTP };