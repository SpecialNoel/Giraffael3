// jwt-token-handler.js

import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from "../config/constants.js";

// Generate a JWT for the user for authentication and authorization
function generateAccessToken(userObjectId, userId) {
    // Construct the payload
    const payload = {
        sub: userObjectId.toString(), // subject is the Objective Id of the user document (private)
        userId                        // userId is the public user id
    };

    // Fetch the secret for JWT generation
    const secret = process.env.JWT_ACCESS_SECRET;

    // Generate accessToken by signing the payload with the secret
    // Note that ACCESS_TOKEN_EXPIRATION is in milliseconds, meaning that we need to divide it by 1000 to get expected unit for expiresIn
    const accessToken = jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRATION / 1000 });
    return accessToken;
}

// Generate a JWT for the user for refreshing accessToken
function generateRefreshToken(userObjectId, userId) {
    // Construct the payload
    const payload = {
        sub: userObjectId.toString(), // subject is the Objective Id of the user document (private)
        userId                        // userId is the public user id
    };

    // Fetch the secret for JWT generation
    const secret = process.env.JWT_REFRESH_SECRET;

    // Generate refreshToken by signing the payload with the secret
    // Note that REFRESH_TOKEN_EXPIRATION is in milliseconds, meaning that we need to divide it by 1000 to get expected unit for expiresIn
    const refreshToken = jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRATION / 1000 });
    return refreshToken;
}

// Verify the accessToken using the secret and check whether it has been tampered with or expired
function verifyAccessToken(accessToken) {
    // Fetch the secret for JWT generation
    const secret = process.env.JWT_ACCESS_SECRET;

    // Verify the accessToken with fetched secret if it has been tempered or expired
    const decoded = jwt.verify(accessToken, secret);
    
    // Return the information stored in the payload of the accessToken
    return { 
        userObjectId: decoded.sub, 
        userId: decoded.userId 
    };
}

// Verify the refreshToken using the secret and check whether it has been tampered with or expired
function verifyRefreshToken(refreshToken) {
    // Fetch the secret for JWT generation
    const secret = process.env.JWT_REFRESH_SECRET;

    // Verify the refreshToken with fetched secret if it has been tempered or expired
    const decoded = jwt.verify(refreshToken, secret);
    
    // Return the information stored in the payload of the refreshToken
    return { 
        userObjectId: decoded.sub, 
        userId: decoded.userId 
    };
}

export { 
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken 
};