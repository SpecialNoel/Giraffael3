// username-generator.js

import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { User } from "../models/user-model.js";

// Generate a username consisting of two words and a number
function generateUsername() {
    const useColorInUsername = Math.random() < 0.5;

    return uniqueNamesGenerator({
            dictionaries: useColorInUsername
                ? [colors, animals]
                : [adjectives, animals],
            length: 2,
            separator: "",
            style: "capital"
        }) + Math.floor(Math.random() * 10000);
}

// Generate an unique default username
async function generateUniqueDefaultUsername() {
    let username;
    while (true) {
        username = generateUsername();
        const usernameExisted = await User.findOne({ username });
        if (!usernameExisted) break;
    }
    return username;
}

export { generateUniqueDefaultUsername };