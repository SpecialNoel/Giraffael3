// authenticate-http.js

import { verifyAccessToken } from "../utils/jwt-token-handler.js";
import { errorResponse } from "../utils/api-response.js";

/*
 * Authenticate the user for operations handled with HTTP endpoints
 * Note: The base page itself does not require HTTP authentication.
 *   It contains no private user information; all private data is fetched
 *   from protected API endpoints, where authenticateHTTP() is enforced.
*/
function authenticateHTTP(req, res, next) {
    // Try to get the access token from the requesting client's browser
    const accessToken = req.cookies.accessToken;
    // Access token is invalid due to missing token
    if (!accessToken) {
        console.log("Authentication failed: missing access token");
        return res.status(401).json(
            errorResponse(
                "MISSING_ACCESS_TOKEN",
                "Access token missing"
            )
        );
    } 

    try {
        // Authenticate the user for operations handled with HTTP endpoints
        const { userObjectId, userId } = verifyAccessToken(accessToken);
        req.user = {
            userObjectId,
            userId,
        };
        next();
        // console.log(`Authenticated user ${userId} for HTTP endpoints.`);
    } catch (err) {
        // Explicitly checking error triggered by an expired access token
        if (err.name === "TokenExpiredError") {
            console.log("Access token expired");
            return res.status(401).json(
                errorResponse(
                    "EXPIRED_ACCESS_TOKEN",
                    "Access token expired"
                )
            );        
        }

        // Access token is invalid due to other reasons
        console.log("Invalid access tokens");
        return res.status(401).json(
            errorResponse(
                "INVALID_ACCESS_TOKEN",
                "Access token is invalid by other reasons"
            )
        );
    }
}

export { authenticateHTTP };