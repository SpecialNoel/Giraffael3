// password-helper.js

import { initializePasswordToggler } from "../../utils/password/password-toggler-handler.js";
import { initializePasswordStrengthMeter } from "../../utils/password/password-strength-meter-handler.js";
import { initializePasswordRuleChecker } from "../../utils/password/password-rule-checker-handler.js";

// Enable the password toggler so that user can hide or show their inputted password
function setUpPasswordToggler() {
    const passwordInputElement = document.querySelector("#plainPassword");
    const passwordToggler = document.querySelector("#password-toggler");
    initializePasswordToggler(passwordInputElement, passwordToggler);
}

// Enable estimation on the strength meter of input password
function setUpPasswordStrengthMeter() {
    const passwordInputElement = document.querySelector("#plainPassword");
    const strengthMeter = document.querySelector("#password-meter");
    const feedbackText = document.querySelector("#password-feedback");
    initializePasswordStrengthMeter(passwordInputElement, strengthMeter, feedbackText);
}

// Enables dynamical password rule update to be displayed to user
function setUpPasswordRuleChecker() {
    const passwordInputElement = document.querySelector("#plainPassword");
    const minLengthRule = document.querySelector("#min-length-rule");
    const maxLengthRule = document.querySelector("#max-length-rule");
    initializePasswordRuleChecker(passwordInputElement, minLengthRule, maxLengthRule);
}

export {
    setUpPasswordToggler,
    setUpPasswordStrengthMeter,
    setUpPasswordRuleChecker
}