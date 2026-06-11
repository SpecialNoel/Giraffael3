// jwt-token-generator.js

import jwt from "jsonwebtoken";

const expiresIn = "1h";

// Generate a JWT for the user for authentication and authorization, which expires in "expiresIn"
function generateToken(userId) {
    // Construct the payload
    const payload = {
        sub: userId // subject is the userId
    };

    // Fetch the secret for JWT generation
    const secret = process.env.JWT_SECRET;

    // Generate the JWT token by signing the payload with the secret
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn });
    return token;
}

// Verify the token using the secret and check whether it has been tampered with or expired
function verifyToken(token) {
    // Fetch the secret for JWT generation
    const secret = process.env.JWT_SECRET;

    // Verify the token with fetched secret if it has been tempered or expired
    const decodedPayload = jwt.verify(token, secret);
    
    // Return the userId stored in the payload of this token
    return decodedPayload.sub.toString();
}

export { generateToken, verifyToken };