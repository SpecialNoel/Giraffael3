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
    * roomStates: { roomCode: { messages, cursor, hasMore } }
    * A mapping of room codes the user has entered to other fields to keep track of the fetched messages and the next batch of messages
    * "messages": [string], a list of messages the user has received and cached from server
    * "cursor": string, the location where last fetched message was located in the database
    * "hasMore": boolean, indicating whether there are more messages from the room to fetch
    */
    roomStates: new Map()
};

function updateRoomState(roomCode, updates) {
    const roomState = dashboardState.roomStates.get(roomCode);
    Object.assign(roomState, updates);
}

export { updateRoomState }