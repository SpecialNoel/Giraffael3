// info-panel-handler.js

import { setUpUpdateUsernameBtn } from "./button-handlers.js";
import { parseResponse } from "../utils/response-parser.js";
import { getUsernameRequest, 
         handleUpdateUsernameRequest } from "./setting-services.js";

// Set up the userId container; userId should be read-only
function setUpUserIdContainer() {
    const userIdContainer = document.createElement("div");
    userIdContainer.className = "user-id-container";

    const userIdLabel = document.createElement("label");
    userIdLabel.textContent = "User ID";

    const userIdValue = document.createElement("span"); // TODO: fetch user's userId and load it here
    userIdValue.className = "user-id-value";
    userIdValue.textContent = "ID 1";

    userIdContainer.appendChild(userIdLabel);
    userIdContainer.appendChild(userIdValue);
    return userIdContainer;
}

// Set up the user email container; user email should be read-only
function setUpUserEmailContainer() {
    const userEmailContainer = document.createElement("div");
    userEmailContainer.className = "user-email-container";

    const userEmailLabel = document.createElement("label");
    userEmailLabel.textContent = "Email";

    const userEmailValue = document.createElement("span"); // TODO: fetch user's email and load it here
    userEmailValue.className = "user-email-value";
    userEmailValue.textContent = "Email address";

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

    const usernameResult = await parseResponse(await getUsernameRequest());
    if (!usernameResult.success) {
        alert("Error in fetching username");
        return;
    }
    usernameValue.value = usernameResult.data.username;

    // Keep a record of the current username
    let currUsernameValue = usernameValue.value;

    // Update-username button
    const updateUsernameBtn = setUpUpdateUsernameBtn();

    // Add components to the username container
    usernameContainer.appendChild(usernameLabel);
    usernameContainer.appendChild(usernameValue);
    usernameContainer.appendChild(updateUsernameBtn);

    // Add functionality to the username container such that it receives and handles update-username requests
    // upon the updateUsernameBtn clicks
    usernameContainer.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newUsername = usernameValue.value;
        // Omit the request if the received input username is the same as the current username
        if (newUsername === currUsernameValue) return;

        // Update the current username
        currUsernameValue = newUsername;

        // Send the username to server
        const result = await parseResponse(await handleUpdateUsernameRequest(newUsername));
        if (!result.success) {
            alert("Error in changing name");
            return;
        }
    });
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

    passwordContainer.appendChild(passwordLabel);
    passwordContainer.appendChild(passwordValue);
    return passwordContainer;
}

export { setUpUserIdContainer, 
         setUpUserEmailContainer, 
         setUpUsernameContainer,
         setUpPasswordContainer };