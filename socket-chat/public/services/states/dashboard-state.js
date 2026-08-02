// dashboard-state.js

// dashboardState is used to keep track of attributes which a client socket (i.e. not the user) has inside the dashboard
export const dashboardState = {
    pendingRoomCode: null, // the room code for the room the user intends to enter
    /* 
    * currentRoom: { roomCode, roomName, loadedMessageCount }
    * The room the user has already entered successfully; it contains roomCode and roomName
    * "roomCode": string, the public code of the current room
    * "roomName": string, the name of the current room
    * "loadedMessageCount": int, the number of messages, exchanged over this room, that the user has fetched and displayed onto their dashboard so far
    */
    currentRoom: null,
    /*
    * roomPaginationStates: { roomCode: { cursor, hasMore } }
    * A mapping of room codes to cursor and hasMore fields to keep track of the next batch of messages to fetch
    * "cursor": string, indicates where the last fetched message was located in the database
    * "hasMore": boolean, indicates whether there are more messages from the room to fetch\
    */
    roomPaginationStates: new Map()
};