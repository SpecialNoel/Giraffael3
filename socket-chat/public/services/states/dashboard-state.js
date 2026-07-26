// dashboard-state.js

// dashboardState is used to keep track of attributes which a client socket (i.e. not the user) has inside the dashboard
export const dashboardState = {
    pendingRoomCode: null, // the room code for the room the user intends to enter
    currentRoom: null,     // the room the user has already entered successfully; it contains roomCode and roomName
    // roomPaginationStates: { roomCode: { cursor, hasMore } }
    // A mapping of room codes to cursor and hasMore fields to keep track of the next batch of messages to fetch
    // A cursor indicates where the last fetched message was located in the database
    // A hasMore field indicates whether there are more messages from the room to fetch
    roomPaginationStates: new Map()
};