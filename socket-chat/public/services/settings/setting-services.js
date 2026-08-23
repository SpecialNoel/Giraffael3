// setting-services.js

import { apiFetch } from "../utils/api-fetcher.js";

async function getUsernameRequest() {
    return await apiFetch("/settings/username");
}

// Send the new username to server
async function handleUpdateUsernameRequest(newUsername) {
    return await apiFetch("/settings/username", {
        method: "PATCH",
        body: JSON.stringify({ 
            username: newUsername
        })
    });
}

export { getUsernameRequest, 
         handleUpdateUsernameRequest };