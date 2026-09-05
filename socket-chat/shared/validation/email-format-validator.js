// email-format-validator.js

const EMAIL_MAX_LENGTH = 254;

function validateEmailFormat(email) {
    // Type check
    if (typeof email !== "string") {
        return {
            success: false,
            message: "Email must be of type string."
        };
    }

    // Max length check
    if (email.length > EMAIL_MAX_LENGTH) {
        return {
            success: false,
            message: `Email must not exceed ${EMAIL_MAX_LENGTH} characters long.`
        };
    }

    // Regex check. Allow: letters, numbers, space, underscore, hyphen 
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        return {
            success: false,
            message: "Please enter a valid email address."
        };    
    }

    return {
        success: true,
        message: "Email meets all requirements."
    }
}

export { validateEmailFormat };