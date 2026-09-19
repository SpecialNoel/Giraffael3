// refresh-http-tokens-handler.js

import { successResponse, errorResponse } from "../../utils/api-response.js";
import { 
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken 
} from "../../utils/jwt-token-handler.js";
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from "../../config/constants.js";

// Refresh the user's accessToken
function refreshHTTPTokens(req, res) {
    // Check refresh token
    const refreshToken = req.cookies.refreshToken;
    // Refresh token is invalid due to missing token
    if (!refreshToken) {
        console.log("Refresh token required");
        return res.status(401).json(
            errorResponse(
                null,
                "Refresh token required"
            )
        );
    }

    try {
        // Verify the refresh token
        const { userObjectId, userId } = verifyRefreshToken(refreshToken);

        // Create new tokens
        const newAccessToken = generateAccessToken(userObjectId, userId);
        const newRefreshToken = generateRefreshToken(userObjectId, userId);

        // Set the new access token as an HTTP-Only cookie in the user's browser
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS if true
            sameSite: "lax", // Allow cookies in some cross-site situations; block many other cross-site requests 
            maxAge: ACCESS_TOKEN_EXPIRATION,
            path: "/"
        });
        // Set the refresh token as an HTTP-Only cookie in the user's browser
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS if true
            sameSite: "lax", // Allow cookies in some cross-site situations; block many other cross-site requests 
            maxAge: REFRESH_TOKEN_EXPIRATION,
            path: "/"
        });

        console.log("Tokens refreshed");
        return res.status(200).json(
            successResponse(
                null,
                "Tokens refreshed"
            )
        );
    } catch (err) {
        // Refresh token is invalid due to it being expired or other reasons
        console.log("Invalid refresh tokens");
        return res.status(401).json(
            errorResponse(
                null,
                "Invalid refresh tokens"
            )
        );
    }
}

export { refreshHTTPTokens };