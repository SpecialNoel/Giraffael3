// password-format-validator.js

const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 128;

// Check the validness of the format of the received password
// Note: password should not be trimmed before or after validation
function validatePasswordFormat(password) {
    // Type check
    if (typeof password !== "string") {
        return {
            success: false,
            message: `Password must be of type string.`
        };
    }

    // Min length check
    if (password.length < PASSWORD_MIN_LENGTH) {
        return {
            success: false,
            message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
        };
    }

    // Max length check
    if (password.length > PASSWORD_MAX_LENGTH) {
        return {
            success: false,
            message: `Password must not exceed ${PASSWORD_MAX_LENGTH} characters long.`
        };    
    }

    return {
        success: true,
        message: "Password meets all requirements."
    }
}

export { 
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    validatePasswordFormat 
};