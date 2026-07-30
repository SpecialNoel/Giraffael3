// constants.js

// Message expiration interval
const SECOND = 1000; // 1000ms = 1s
const MINUTE = 60 * SECOND; // 1 minute
const HOUR = 60 * MINUTE; // 1 hour
export const MESSAGE_EXPIRATION_MS = 1 * HOUR; // 1 hour
export const MESSAGE_CLEANUP_INTERVAL_MS = 5 * MINUTE // 5 minutes

// Message quantity
export const INITIAL_MESSAGE_LIMIT = 10; // fetch 10 messages upon user entering the room
export const MESSAGE_FETCH_LIMIT = 10; // fetch 10 more messages user scrolling to the top of conversation element