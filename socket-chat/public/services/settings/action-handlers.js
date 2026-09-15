// action-handlers.js

import { parseResponse } from "../../utils/api.js";
import { handleUpdateUsernameRequest, handleUpdatePasswordRequest } from "./setting-api.js";
import { validatePasswordFormat } from "/shared/validation/password-format-validator.js";
import { getPasswordFields } from "./password-fields.js";
import { initializePasswordToggler, resetPasswordToggler } from "../../utils/password/password-toggler-handler.js";
import { initializePasswordStrengthMeter } from "../../utils/password/password-strength-meter-handler.js";
import { initializePasswordRuleChecker } from "../../utils/password/password-rule-checker-handler.js";

// Redirection helper
function setUpRedirectButton(selector, destination) {
    const button = document.querySelector(selector);
    if (!button) return;

    button.addEventListener("click", () => {
        window.location.href = destination;
    });
}

// Redirect the user back to the Dashboard page when clicked
function setUpBackToDashboardButton() {
    setUpRedirectButton(".back-to-dashboard-btn", "/dashboard")
}

// Redirect the user back to the Sign-in page when clicked
function setUpLogoutButton() {
    setUpRedirectButton(".logout-btn", "/signin")
}

// Receives and handles change-username requests upon submission
function setUpChangeUsernameListener(currUsernameValue) {
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

// Reset the password togglers to hide all passwords fields
function resetPasswordTogglers() {
    const passwordFields = getPasswordFields();
    passwordFields.forEach(({ input, toggler }) => {
        resetPasswordToggler(input, toggler);
    });
}

// Opens the change password panel when clicked, by making the panel and the overlay visible
function setUpOpenChangePasswordPanelBtn() {
    const changePasswordPanel = document.querySelector(".change-password-panel");
    const overlay = document.querySelector(".overlay");
    const openBtn = document.querySelector(".open-change-password-panel-btn");

    openBtn.addEventListener("click", () => {
        changePasswordPanel.classList.add("visible");
        overlay.classList.add("visible");
    });
}

// Closes the change password panel by making the panel and the overlay invisible,
// as well as clearing inputs inside the panel
function closeChangePasswordPanel() {
    // Reset input fields
    const currentPasswordValue = document.querySelector(".current-password-value");
    const newPasswordValue = document.querySelector(".new-password-value");
    const confirmNewPasswordValue = document.querySelector(".confirm-new-password-value");
    const passwordStatus = document.querySelector(".password-status");
    const changePasswordPanel = document.querySelector(".change-password-panel");
    const overlay = document.querySelector(".overlay");

    currentPasswordValue.value = "";
    newPasswordValue.value = "";
    confirmNewPasswordValue.value = "";
    passwordStatus.textContent = "";

    // Reset the password togglers to hide all passwords fields
    resetPasswordTogglers();

    // "Deactivate" the panel and overlay by removing them from view
    changePasswordPanel.classList.remove("visible");
    overlay.classList.remove("visible");
}

// Closes the change password panel when clicked
function setUpCloseChangePasswordPanelBtn() {
    const closeBtn = document.querySelector(".close-change-password-panel-btn");
    if (!closeBtn) return;

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

// Enable the password togglers so that user can hide or show their inputted passwords
function setUpPasswordTogglers() {
    const passwordFields = getPasswordFields();
    passwordFields.forEach(({ input, toggler }) => {
        initializePasswordToggler(input, toggler);
    });
}

// Enable estimation on the strength meter of input password
function setUpPasswordStrengthMeter() {
    const passwordInputElement = document.querySelector(".new-password-value");
    const strengthMeter = document.querySelector("#password-meter");
    const feedbackText = document.querySelector("#password-feedback");
    initializePasswordStrengthMeter(passwordInputElement, strengthMeter, feedbackText);
}

// Enables dynamical password rule update to be displayed to user
function setUpPasswordRuleChecker() {
    const passwordInputElement = document.querySelector(".new-password-value");
    const minLengthRule = document.querySelector("#min-length-rule");
    const maxLengthRule = document.querySelector("#max-length-rule");
    initializePasswordRuleChecker(passwordInputElement, minLengthRule, maxLengthRule);
}

// Receives and handles change-password requests upon submission
function setUpChangePasswordListener() {
    const changePasswordContainer = document.querySelector(".change-password-container");
    const passwordStatus = document.querySelector(".password-status");
    const currentPasswordValue = document.querySelector(".current-password-value");
    const newPasswordValue = document.querySelector(".new-password-value");
    const confirmNewPasswordValue = document.querySelector(".confirm-new-password-value");

    /* 
     * Client side only do some trivial checks like validate the format of the
     * received new password and compare new password with the confirm new password. 
     * 
     * Server side needs to do these checks as well, in addition to 
     * check the correctness of current password by comparing its hash against the
     * one stored in database, hash the new password, check whether the new password 
     * is the same as the current password by comparing their hashes, and 
     * finally update the database. 
     */
    changePasswordContainer.addEventListener("submit", async (event) => {
        event.preventDefault();
        passwordStatus.textContent = "";

        const currentPassword = currentPasswordValue.value;
        const newPassword = newPasswordValue.value;
        const confirmNewPassword = confirmNewPasswordValue.value;

        // Validate the format of the received new password
        const validateResult = validatePasswordFormat(newPassword);
        if (!validateResult.success) {
            // The format of this new password is not valid. Update password status
            passwordStatus.textContent = validateResult.message;
            return;
        }

        // Compare the received new password against with the received confirm new password
        if (newPassword !== confirmNewPassword) {
            // New password does not match confirm new password. Update password status
            passwordStatus.textContent = "Passwords do not match";
            return;
        }

        try {
            // Send the received current and new passwords to server, and receive response from server
            const result = await parseResponse(await handleUpdatePasswordRequest(currentPassword, newPassword, confirmNewPassword));
            // Display the success message if the operation succeeded
            passwordStatus.textContent = result.message;
            console.log("Password updated successfully.");
        } catch (err) {
            // Display the error message if the operation failed
            passwordStatus.textContent = err.message;
            console.error(err);        
        }
    });
}

export { 
    setUpBackToDashboardButton, 
    setUpLogoutButton,
    setUpChangeUsernameListener,
    setUpOpenChangePasswordPanelBtn,
    setUpCloseChangePasswordPanelBtn,
    setUpOverlay,
    setUpPasswordTogglers,
    setUpPasswordStrengthMeter,
    setUpPasswordRuleChecker,
    setUpChangePasswordListener
};