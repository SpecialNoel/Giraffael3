// message-expiration-helper.js

// Return the Date where the message would expire by the date, based on expiration type
function calculateExpiresAt(expiration) {
    // expiration types are included inside room-model.js
    const now = Date.now();

    switch (expiration) {
        case "1_hour":
            return new Date(now + 60 * 60 * 1000);
        case "1_day":
            return new Date(now + 24 * 60 * 60 * 1000);
        case "1_week":
            return new Date(now + 7 * 24 * 60 * 60 * 1000);
        case "1_month":
            return new Date(now + 30 * 24 * 60 * 60 * 1000);
        case "never":
            return null;
        default: 
            return null;
    }
}

export { calculateExpiresAt }