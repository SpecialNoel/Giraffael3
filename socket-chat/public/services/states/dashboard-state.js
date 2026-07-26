// dashboard-state.js

// dashboardState is used to keep track of attributes which a client socket (i.e. not the user) has inside the dashboard
export const dashboardState = {
    pendingRoomCode: null, // the room code for the room the user intends to enter
    currentRoom: null,  // the room the user has already entered successfully (contains roomCode and roomName)
    roomPaginationStates: new Map(), // a mapping that keeps track of the next batch of messages to fetch
};