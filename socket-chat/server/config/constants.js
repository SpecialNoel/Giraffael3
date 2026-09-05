// constants.js

// Message expiration interval
// ["1_hour", "1_day", "1_week", "1_month", "never"]
export const MESSAGE_EXPIRATION_TYPE = "1_hour"; // options are included in "messageExpiration", room-model.js

// Message quantity
export const INITIAL_MESSAGE_LIMIT = 10; // fetch 10 messages upon user entering the room
export const MESSAGE_FETCH_LIMIT = 10; // fetch 10 older messages user scrolling to the top of conversation element