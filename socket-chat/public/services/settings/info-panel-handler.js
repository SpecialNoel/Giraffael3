// info-panel-handler.js

import { parseResponse } from "../utils/response-parser.js";
import { getUserInfoRequest } from "./setting-services.js";
import { 
    setUpUsernameUpdateListener,
    setUpOpenEditPasswordPanelBtn,
    setUpCloseEditPasswordPanelBtn,
    setUpOverlay
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

// Set up the username container; username should be editable
async function setUpUsernameContainer() {
    const usernameResult = await parseResponse(await getUserInfoRequest("username"));
    if (!usernameResult.success) {
        alert("Error in fetching username");
        return;
    }
    const usernameValue = document.querySelector(".username-value");
    usernameValue.value = usernameResult.data.username;

    // Handle username-update requests upon the updateUsernameBtn clicks
    setUpUsernameUpdateListener(usernameValue.value);
}

// Set up the password container; password should be read-only
function setUpPasswordContainer() {
    // Add functionality to the button such that it opens the edit password panel upon clicking
    setUpOpenEditPasswordPanelBtn();

    // Add functionality to the button such that it closes the edit password panel upon clicking
    setUpCloseEditPasswordPanelBtn();

    // Set up the overlay such that it closes upon clicking
    setUpOverlay();
}

export { 
    fetchAndUpdateUserId, 
    fetchAndUpdateUserEmail, 
    setUpUsernameContainer,
    setUpPasswordContainer
};