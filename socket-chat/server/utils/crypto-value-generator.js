// crypto-value-generator.js

import crypto from "crypto";

function generateRoomCode(length=11) {
    return crypto.randomBytes(length).toString("base64url").slice(0, length).toUpperCase();
}

function generateUserId(length=13) {
    return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

export { generateRoomCode, generateUserId };
