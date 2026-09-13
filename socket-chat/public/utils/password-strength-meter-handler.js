// password-strength-meter-handler.js

// Enable estimation on the strength meter of passwords
// Credit: https://github.com/dropbox/zxcvbn
function initializePasswordStrengthMeter(passwordInputElement, strengthMeter, feedbackText) {
    passwordInputElement.addEventListener("input", (e) => {
        // Calculate strength with the zxcvbn library
        const result = zxcvbn(e.target.value);

        // result.score is an integer from 0 (weakest) to 4 (strongest)
        strengthMeter.value = result.score;

        // Display any warning or suggestion
        feedbackText.textContent = result.feedback.warning || result.feedback.suggestions[0] || "";
    });
}

export { initializePasswordStrengthMeter };