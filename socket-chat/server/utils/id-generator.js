// id-generator.js

import crypto from "crypto";

// // Generate a random identifier; 8 characters by default
function generateIdentifier(codeLength=8) {
    // Characters with '1', 'I', '0', 'O' removed to avoid ambiguous characters
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < codeLength; i++) {
        code += characters[crypto.randomInt(characters.length)];
    }
    return code;
}

export { generateIdentifier };
