// info-panel-handler.js

import { parseResponse } from "../utils/response-parser.js";
import { getUserInfoRequest } from "./setting-api.js";
import { 
    setUpChangeUsernameListener,
    setUpOpenChangePasswordPanelBtn,
    setUpCloseChangePasswordPanelBtn,
    setUpOverlay,
    setUpChangePasswordListener,
} from "./action-handlers.js";

// Fetch userId from server, then update the value on Settings page; userId should be read-only
async function fetchAndUpdateUserId() {
    const userIdResult = await parseResponse(await getUserInfoRequest("user-id"));
    if (!userIdResult.success) {
        alert("Error in fetching user id");
        return;
    }

    const userIdValue = document.querySelector(".user-id-value");
    userIdValue.textContent = userIdResult.data.userId;
}

// Fetch user email from server, then update the value on Settings page; user email should be read-only
async function fetchAndUpdateUserEmail() {
    const userEmailResult = await parseResponse(await getUserInfoRequest("user-email"));
    if (!userEmailResult.success) {
        alert("Error in fetching user email");
        return;
    }

    const userEmailValue = document.querySelector(".user-email-value");
    userEmailValue.textContent = userEmailResult.data.userEmail;
}

// Set up the username container; username should be mutable
async function setUpUsernameContainer() {
    const usernameResult = await parseResponse(await getUserInfoRequest("username"));
    if (!usernameResult.success) {
        alert("Error in fetching username");
        return;
    }
    
    const usernameValue = document.querySelector(".username-value");
    usernameValue.value = usernameResult.data.username;
    // Handle change-username requests upon submission
    setUpChangeUsernameListener(usernameValue.value);
}

// Set up the change password panel container
function setUpChangePasswordPanelContainer() {
    // Opens the change password panel when clicked
    setUpOpenChangePasswordPanelBtn();
    // Closes the change password panel when clicked
    setUpCloseChangePasswordPanelBtn();
    // Set up the overlay such that it closes when clicked
    setUpOverlay(); // overlay activates when change password panel is opened; it deactivates when the panel is closed
    // Save the changes made to the password by sending received input to server
    setUpChangePasswordListener();
}

export { 
    fetchAndUpdateUserId, 
    fetchAndUpdateUserEmail, 
    setUpUsernameContainer,
    setUpChangePasswordPanelContainer
};