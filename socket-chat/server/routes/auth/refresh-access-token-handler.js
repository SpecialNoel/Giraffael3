// refresh-access-token-handler.js

import { successResponse, errorResponse } from "../../utils/api-response.js";
import { verifyRefreshToken, generateAccessToken } from "../../utils/jwt-token-handler.js";

// Refresh the user's accessToken
function refreshAccessToken(req, res) {
    // Fetch the refreshToken from the request sent from the user's browser
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json(
            errorResponse(
                null,
                "Refresh token required"
            )        
        );
    }

    try {
        // Verify the refreshToken
        const { userObjectId, userId } = verifyRefreshToken(refreshToken);

        // Generate a new accessToken
        const accessToken = generateAccessToken(userObjectId, userId);

        // Set the new accessToken as an HTTP-Only cookie in the user's browser
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS if true
            sameSite: "lax", // Allow cookies in some cross-site situations; block many other cross-site requests 
            maxAge: 15*60*1000, // 15 minutes
            path: "/"
        });

        console.log("Refreshed access token.");

        return res.status(200).json(
            successResponse(
                {},
                "Access token refreshed successfully"
            )
        );
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json(
                errorResponse(
                    null,
                    "Refresh token expired"
                )
            );
        }

        return res.status(401).json(
            errorResponse(
                null,
                "Invalid refresh token"
            )
        );
    }
}

export { refreshAccessToken };