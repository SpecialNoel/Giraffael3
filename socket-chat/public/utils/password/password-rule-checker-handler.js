// password-rule-checker-handler.js

import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "/shared/validation/password-format-validator.js";

// Update the text to reflect requirement satisfaction on user input
function updateRuleText(id, passed, text) {
    const element = document.querySelector(`#${id}`);
    if (passed) element.textContent = `✓ ${text}`;
    else element.textContent = `✗ ${text}`;
}

// Enables dynamical password rule update to be displayed to user
function initializePasswordRuleChecker(passwordInputElement, minLengthRule, maxLengthRule) {
    const minLengthText = `At least ${PASSWORD_MIN_LENGTH} characters`;
    const maxLengthText = `No more than ${PASSWORD_MAX_LENGTH} characters`;

    minLengthRule.textContent = minLengthText
    maxLengthRule.textContent = maxLengthText

    // Update text on user password input
    passwordInputElement.addEventListener("input", () => {
        const password = passwordInputElement.value;

        // Update text on max length rule
        updateRuleText(
            "min-length-rule",
            password.length >= PASSWORD_MIN_LENGTH,
            minLengthText
        );

        // Update text on max length rule
        updateRuleText(
            "max-length-rule",
            password.length <= PASSWORD_MAX_LENGTH,
            maxLengthText
        );
    });
}

export { initializePasswordRuleChecker };