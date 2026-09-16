// jwt-token-handler.js

import jwt from "jsonwebtoken";

// Generate a JWT for the user for authentication and authorization
function generateAccessToken(userObjectId, userId) {
    // Construct the payload
    const payload = {
        sub: userObjectId.toString(), // subject is the Objective Id of the user document (private)
        userId                        // userId is the public user id
    };

    // Fetch the secret for JWT generation
    const secret = process.env.JWT_SECRET;

    // Generate accessToken by signing the payload with the secret
    const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" });
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
    const secret = process.env.JWT_SECRET;

    // Generate refreshToken by signing the payload with the secret
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "1d" });
    return refreshToken;
}

// Verify the accessToken using the secret and check whether it has been tampered with or expired
function verifyAccessToken(accessToken) {
    // Fetch the secret for JWT generation
    const secret = process.env.JWT_SECRET;

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
    const secret = process.env.JWT_SECRET;

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