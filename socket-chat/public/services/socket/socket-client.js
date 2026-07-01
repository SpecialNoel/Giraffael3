// socket-client.js

// Create a socket and send the JWT token to server for authentication using the socket
function createAuthenticatedSocket() {
    const token = localStorage.getItem("token");
    const socket = io({
        auth: { token }
    });

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