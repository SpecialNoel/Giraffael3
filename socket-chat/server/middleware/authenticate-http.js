// authenticate-http.js

import { verifyAccessToken } from "../utils/jwt-token-handler.js";
import { errorResponse } from "../utils/api-response.js";

// Authenticate the user for operations handled with http api endpoints
function authenticateHTTP(req, res, next) {
    // Try to get the access token from the requesting client's browser
    const accessToken = req.cookies.accessToken;
    // Access token is invalid due to missing token
    if (!accessToken) {
        console.log("Authentication required for missing access token");
        return res.status(401).json(
            errorResponse(
                null,
                "Authentication required for missing access token"
            )
        );
    } 

    try {
        const { userObjectId, userId } = verifyAccessToken(accessToken);

        console.log("Decoded access token =", {
            userObjectId,
            userId,
            userObjectIdType: typeof userObjectId,
            userIdType: typeof userId
        });

        req.user = {
            userObjectId,
            userId,
        };
        next();
        // console.log(`Authenticated user ${userId} for HTTP endpoints.`);
    } catch (err) {
        // Access token is invalid due to it being expired
        if (err.name === "TokenExpiredError") {
            console.log("Access token expired");
            return res.status(401).json(
                errorResponse(
                    null,
                    "Access token expired"
                )
            );        
        }

        // Access token is invalid due to other reasons
        console.log("Invalid access tokens");
        return res.status(401).json(
            errorResponse(
                null,
                "Invalid access token"
            )
        );
    }
}

export { authenticateHTTP };