// info-panel-handler.js

import { 
    createUpdateUsernameBtn,
    createOpenPasswordUpdatePanelBtn
} from "./button-creators.js";
import { parseResponse } from "../utils/response-parser.js";
import { getUserInfoRequest } from "./setting-services.js";
import { 
    addUsernameUpdateListener,
    setUpOpenPasswordUpdatePanelBtn
} from "./action-handlers.js";

// Set up the userId container; userId should be read-only
async function setUpUserIdContainer() {
    const userIdContainer = document.createElement("div");
    userIdContainer.className = "user-id-container";

    const userIdLabel = document.createElement("label");
    userIdLabel.textContent = "User ID";

    const userIdValue = document.createElement("span");
    userIdValue.className = "user-id-value";

    const userIdResult = await parseResponse(await getUserInfoRequest("user-id"));
    if (!userIdResult.success) {
        alert("Error in fetching user id");
        return;
    }
    userIdValue.textContent = userIdResult.data.userId;

    userIdContainer.appendChild(userIdLabel);
    userIdContainer.appendChild(userIdValue);
    return userIdContainer;
}

// Set up the user email container; user email should be read-only
async function setUpUserEmailContainer() {
    const userEmailContainer = document.createElement("div");
    userEmailContainer.className = "user-email-container";

    const userEmailLabel = document.createElement("label");
    userEmailLabel.textContent = "Email";

    const userEmailValue = document.createElement("span");
    userEmailValue.className = "user-email-value";
    userEmailValue.textContent = "Email address";

    const userEmailResult = await parseResponse(await getUserInfoRequest("user-email"));
    if (!userEmailResult.success) {
        alert("Error in fetching user email");
        return;
    }
    userEmailValue.textContent = userEmailResult.data.userEmail;

    userEmailContainer.appendChild(userEmailLabel);
    userEmailContainer.appendChild(userEmailValue);
    return userEmailContainer;
}

// Set up the username container; username should be editable
async function setUpUsernameContainer() {
    const usernameContainer = document.createElement("form");
    usernameContainer.className = "username-container";

    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "Username";

    const usernameValue = document.createElement("input");
    usernameValue.className = "username-value";
    usernameValue.type = "text";

    const usernameResult = await parseResponse(await getUserInfoRequest("username"));
    if (!usernameResult.success) {
        alert("Error in fetching username");
        return;
    }
    usernameValue.value = usernameResult.data.username;

    // Update-username button
    const updateUsernameBtn = createUpdateUsernameBtn();

    // The status of user's username-update operation
    const usernameStatus = document.createElement("span");
    usernameStatus.className = "username-status";

    // Add components to the username container
    usernameContainer.appendChild(usernameLabel);
    usernameContainer.appendChild(usernameValue);
    usernameContainer.appendChild(updateUsernameBtn);
    usernameContainer.appendChild(usernameStatus);

    // Add functionality to the username container such that it receives and handles update-username requests
    // upon the updateUsernameBtn clicks
    addUsernameUpdateListener(usernameContainer, 
                              usernameStatus, 
                              usernameValue, 
                              usernameValue.value);
    return usernameContainer;
}

// Set up the password container; password should be read-only
function setUpPasswordContainer() {
    const passwordContainer = document.createElement("div");
    passwordContainer.className = "password-container";

    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password";

    const passwordValue = document.createElement("span");
    passwordValue.className = "password-value";
    passwordValue.textContent = "••••••••••••";

    // Open-password-update-panel button, which opens a separate panel upon clicking
    const openPasswordUpdatePanelBtn = createOpenPasswordUpdatePanelBtn();

    passwordContainer.appendChild(passwordLabel);
    passwordContainer.appendChild(passwordValue);
    passwordContainer.appendChild(openPasswordUpdatePanelBtn);

    // Add functionality to the openPasswordUpdatePanelBtn such that it opens the password update panel upon clicking
    setUpOpenPasswordUpdatePanelBtn()
    return passwordContainer;
}

export { 
    setUpUserIdContainer, 
    setUpUserEmailContainer, 
    setUpUsernameContainer,
    setUpPasswordContainer
};