// socket-client.js

// Create a socket to connect to server for socket authentication
function createAuthenticatedSocket() {
    const socket = io();

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

export { createAuthenticatedSocket };