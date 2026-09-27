// constants.js

// Message expiration interval
// ["1_hour", "1_day", "1_week", "1_month", "never"]
export const MESSAGE_EXPIRATION_TYPE = "never"; // options are included in "messageExpiration", room-model.js

// Message quantity
export const INITIAL_MESSAGE_LIMIT = 10; // fetch 10 messages upon user entering the room
export const MESSAGE_FETCH_LIMIT = 10; // fetch 10 older messages user scrolling to the top of conversation element

// Token expiration
// Note that token creation is based on milliseconds. e.g.: 15*60*1000 = 15 minutes
export const ACCESS_TOKEN_EXPIRATION = 0.25*60*1000; // the access token expires 15 minutes after creation
export const REFRESH_TOKEN_EXPIRATION = 0.5*60*1000; // the access token expires 1 day after creation
