// username-format-validator.js

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_PATTERN = /^[A-Za-z0-9]+$/;

// Check the validness of the format of the received username
// Note: trim username before validation
function validateUsernameFormat(username) {
    // Type check
    if (typeof username !== "string") {
        return {
            success: false,
            message: "Username must be of type string."
        };
    }

    // Min length check
    if (username.length < USERNAME_MIN_LENGTH) {
        return {
            success: false,
            message: `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`
        };
    }

    // Max length check
    if (username.length > USERNAME_MAX_LENGTH) {
        return {
            success: false,
            message: `Username must not exceed ${USERNAME_MAX_LENGTH} characters long.`
        };    
    }

    // Regex check
    if (!(USERNAME_PATTERN.test(username))) {
        return {
            success: false,
            message: "Username can only contain alphabets and numbers."
        };    
    }

    return {
        success: true,
        message: "Username meets all requirements."
    }
}

export { validateUsernameFormat };