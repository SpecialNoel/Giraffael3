// jwt-token-generator.js

import jwt from "jsonwebtoken";

// Generate a JWT for the user for authentication and authorization, which expires in "expiresIn"
function generateToken(_id, userId, expiresIn = "1h") {
    // Construct the payload
    const payload = {
        sub: _id.toString(), // subject is the Objective Id of the user document (private)
        userId               // userId is the public user id
    };

    // Fetch the secret for JWT generation
    const secret = process.env.JWT_SECRET;

    // Generate the JWT token by signing the payload with the secret
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
}

// Verify the token using the secret and check whether it has been tampered with or expired
function verifyToken(token) {
    // Fetch the secret for JWT generation
    const secret = process.env.JWT_SECRET;

    // Verify the token with fetched secret if it has been tempered or expired
    const decoded = jwt.verify(token, secret);
    
    // Return the information stored in the payload of this token
    return { 
        _id: decoded.sub, 
        userId: decoded.userId 
    };
}

export { generateToken, verifyToken };