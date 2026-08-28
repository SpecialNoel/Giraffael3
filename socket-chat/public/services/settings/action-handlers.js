// action-handlers.js

import { parseResponse } from "../utils/response-parser.js";
import { handleUpdateUsernameRequest } from "./setting-services.js";

// Redirect the user back to the Dashboard page when clicked
function setUpBackToDashboardButton() {
    const backButton = document.querySelector(".back-to-dashboard-btn");
    if (!backButton) return;
    backButton.addEventListener("click", () => {
        window.location.href = "/dashboard";
    });
}

// Redirect the user back to the Sign-in page when clicked
function setUpLogoutButton() {
    const logoutButton = document.querySelector(".logout-btn");
    if (!logoutButton) return;
    logoutButton.addEventListener("click", () => {
        window.location.href = "/signin";
    });
}

// Receives and handles update-username requests upon submission
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

// Opens the password update panel when clicked
function setUpOpenChangePasswordPanelBtn() {
    const changePasswordPanel = document.querySelector(".change-password-panel");
    const overlay = document.querySelector(".overlay");
    const openBtn = document.querySelector(".open-change-password-panel-btn");
    openBtn.addEventListener("click", () => {
        changePasswordPanel.classList.add("visible");
        overlay.classList.add("visible");
    });
}


function closeChangePasswordPanel() {
    const changePasswordPanel = document.querySelector(".change-password-panel");
    const overlay = document.querySelector(".overlay");
    changePasswordPanel.classList.remove("visible");
    overlay.classList.remove("visible");
}

function setUpCloseChangePasswordPanelBtn() {
    const closeBtn = document.querySelector(".close-change-password-panel-btn");
    closeBtn.addEventListener("click", () => {
        closeChangePasswordPanel();
    });
}

// Close the overlay when the user clicks on it while it is visible
function setUpOverlay() {
    const overlay = document.querySelector(".overlay");
    overlay.addEventListener("click", () => {
        closeChangePasswordPanel();
    });
}

export { 
    setUpBackToDashboardButton, 
    setUpLogoutButton,
    setUpUsernameUpdateListener,
    setUpOpenChangePasswordPanelBtn,
    setUpCloseChangePasswordPanelBtn,
    setUpOverlay
};