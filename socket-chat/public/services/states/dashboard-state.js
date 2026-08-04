// dashboard-state.js

// dashboardState is used to keep track of attributes which a client socket (i.e. not the user itself) had inside the dashboard
export const dashboardState = {
    // The room code for the room the user intended to enter
    pendingRoomCode: null,
    /* 
    * currentRoom: { roomCode, roomName }
    * The room the user has already entered successfully
    * "roomCode": string, the public code of the current room
    * "roomName": string, the name of the current room
    */
    currentRoom: null,
    /*
    * roomStates: { roomCode: { members, messages, cursor, hasMore } }
    * A mapping of room codes the user has entered to other fields to keep track of the fetched messages and the next batch of messages
    * "members": [{userId, username}], a list of users who joined the room
    * "messages": [{username, content}], a list of cached messages sent over the room
    * "cursor": string, the location where last fetched message was located in the database
    * "hasMore": boolean, indicating whether there are more messages from the room to fetch
    */
    roomStates: new Map()
};

function getCurrentRoomState(roomCode) {
    // Get the corresponding existing room state, if any
    return dashboardState.roomStates.get(roomCode) ?? null;
}

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