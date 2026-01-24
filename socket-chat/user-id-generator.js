// user-id-generator.js

import crypto from "crypto";

function generateUserId(length=13) {
    return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

export default generateUserId;
