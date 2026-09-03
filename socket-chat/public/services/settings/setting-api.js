// setting-api.js

import { apiFetch } from "../utils/api-fetcher.js";

// Send a request to server to fetch the corresponding information about user
// endpoint can be: [user-id, user-email, username] 
async function getUserInfoRequest(endpoint) {
    return await apiFetch(`/settings/${endpoint}`);
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

async function handleUpdatePasswordRequest(currentPassword, newPassword, confirmNewPassword) {
    return await apiFetch("/settings/password", {
        method: "PATCH",
        body: JSON.stringify({ 
            currentPassword,
            newPassword,
            confirmNewPassword
        })
    });
}

export {
    getUserInfoRequest, 
    handleUpdateUsernameRequest,
    handleUpdatePasswordRequest
};