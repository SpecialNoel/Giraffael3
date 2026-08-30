// password-format-validator.js

// IMPORTANT:
// This policy must remain consistent with the server/client password policy.

const MIN_PASSWORD_LENGTH = 8;

// Check the validness of the received password
function validatePasswordFormat(password) {
    // Min length check
    if (password.length < MIN_PASSWORD_LENGTH) {
        return {
            success: false,
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
        };
    }

    return {
        success: true,
        message: "Password meets all requirements."
    }
}

export { validatePasswordFormat };