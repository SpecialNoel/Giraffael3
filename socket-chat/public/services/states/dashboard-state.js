// dashboard-state.js

/* 
* dashboardState contains the application state (on dashboard) associated with the current client.
* It is independent of any particular Socket.IO connection. This means that while a socket can
* disconnect/reconnect, the client application state (i.e. dashboardState here) remains intact.
*/
export const dashboardState = {
    // The room code for the room the user intended to enter
    pendingRoomCode: null,

    /* 
    * currentRoom: { 
    *     roomCode, 
    *     roomName
    * }
    * The room the user has already entered successfully
    * "roomCode": string, the public code of the current room
    * "roomName": string, the name of the current room
    */

    currentRoom: null,
    /*
    * roomStates: { 
    *     roomCode: { 
    *         members, 
    *         messages, 
    *         cursor, 
    *         hasMore
    *     }
    * }
    * A mapping of room codes to client-side state maintained for each room the user has entered.
    * "members": [{userId, username}], a list of users who joined the room
    * "messages": [{username, content}], a list of cached messages sent over the room
    * "cursor": string, the location where last fetched message was located in the database
    * "hasMore": boolean, indicating whether there are more messages from the room to fetch
    */
    roomStates: new Map()
};

// Get the corresponding existing room state, if any
function getCurrentRoomState(roomCode) {
    return dashboardState.roomStates.get(roomCode) ?? null;
}

// Update the state of the target room in dashboardState
function updateRoomState(roomCode, updates) {
    // Get the room state that that corresponds to room code; it is guaranteed at least initialized
    function ensureRoomState(roomCode) {
        if (!dashboardState.roomStates.has(roomCode)) {
            // Initialize the mapping pair for current room code
            dashboardState.roomStates.set(roomCode, {
                members: [],
                messages: [],
                cursor: null,
                hasMore: true
            });
        }
        return dashboardState.roomStates.get(roomCode);
    }
    const roomState = ensureRoomState(roomCode);
    Object.assign(roomState, updates);
}

export { getCurrentRoomState, updateRoomState }