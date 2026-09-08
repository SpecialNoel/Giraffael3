// socket-creator.js

// socket: a client side socket, used to connect to server for socket communication
// socket is exported and will be used in socket-related functions in other files
let socket = null;

// Create a socket to connect to server for socket authentication
function createAuthenticatedSocket() {
    // Return the socket if it was already created before
    if (socket) return socket;

    socket = io();

    return new Promise((resolve, reject) => {
        // Connect the socket to server
        socket.once("connect", () => {
            // Receive response on token authentication
            console.log("Connected and authenticated socket");

            // Return this authenticated socket
            resolve(socket);
        });

        // Server side triggered "next(new Error())"
        socket.once("connect_error", reject);
    });
}

// Return the client socket if the connection and authentication with server succeeded; return null otherwise 
function getAuthenticatedSocket() {
    return socket;
}

export { 
    createAuthenticatedSocket,
    getAuthenticatedSocket 
};