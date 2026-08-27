// action-handlers.js

import { parseResponse } from "../utils/response-parser.js";
import { handleUpdateUsernameRequest } from "./setting-services.js";

function setUpBackToDashboardButton() {
    const backButton = document.querySelector(".back-to-dashboard-btn");
    if (!backButton) return;

    backButton.addEventListener("click", () => {
        window.location.href = "/dashboard";
    });
}

function setUpLogoutButton() {
    const logoutButton = document.querySelector(".logout-btn");
    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {
        window.location.href = "/signin";
    });
}

// Add functionality to the username container such that it receives and handles update-username requests
// upon the updateUsernameBtn clicks
function setUpUsernameUpdateListener(currUsernameValue) {
    const usernameContainer = document.querySelector(".username-container");
    const usernameStatus = document.querySelector(".username-status");
    const usernameValue = document.querySelector(".username-value");
    
    usernameContainer.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newUsername = usernameValue.value;
        // Omit the request if the received input username is the same as the current username
        if (newUsername === currUsernameValue) {
            usernameStatus.textContent = "No changes to save.";
            return;
        }

        try {
            // Send the username to server, and receive a response from server
            const result = await parseResponse(await handleUpdateUsernameRequest(newUsername));
            
            // Display the success message if the operation succeeded
            usernameStatus.textContent = result.message;
        
            // Update the current username
            currUsernameValue = newUsername;
            console.log("Username updated successfully.");
        } catch (err) {
            // Display the error message if the operation failed
            usernameStatus.textContent = err.message;
            console.error(err);
        }
    });
}

// Add functionality to the button such that it opens the password update panel upon clicking
function setUpOpenEditPasswordPanelBtn() {
    const editPasswordPanel = document.querySelector(".edit-password-panel");
    const overlay = document.querySelector(".overlay");
    const openBtn = document.querySelector(".open-password-update-panel-btn");

    openBtn.addEventListener("click", () => {
        editPasswordPanel.classList.add("visible");
        overlay.classList.add("visible");
    });
}

function closeEditPasswordPanel() {
    const editPasswordPanel = document.querySelector(".edit-password-panel");
    const overlay = document.querySelector(".overlay");

    editPasswordPanel.classList.remove("visible");
    overlay.classList.remove("visible");
}

function setUpCloseEditPasswordPanelBtn() {
    const closeBtn = document.querySelector(".close-edit-password-panel-btn");

    closeBtn.addEventListener("click", () => {
        closeEditPasswordPanel();
    });
}

// Close the overlay when the user clicks on it while it is visible
function setUpOverlay() {
    const overlay = document.querySelector(".overlay");

    overlay.addEventListener("click", () => {
        closeEditPasswordPanel();
    });
}

export { 
    setUpBackToDashboardButton, 
    setUpLogoutButton,
    setUpUsernameUpdateListener,
    setUpOpenEditPasswordPanelBtn,
    setUpCloseEditPasswordPanelBtn,
    setUpOverlay
};