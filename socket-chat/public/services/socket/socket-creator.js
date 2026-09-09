// socket-creator.js

// socket: a client side socket, used to connect to server for socket communication
// socket will be exported and used in socket-related functions in other files
let socket = null;

// Create a socket and establish connection with server socket
function connectSocket() {
    // Return the socket if it was already created before
    if (socket) return socket;

    // Create the socket, which tries to connect with server side socket via SocketIO
    socket = io();

    return new Promise((resolve, reject) => {
        // "connect" is fired by SocketIO on server side when the connection is established successfully
        socket.once("connect", () => {
            // Receive response on socket connection
            console.log("Connected client socket to server");

            // fulfill the promise with this connected socket
            resolve(socket);
        });

        // "connection_error" is fired by SocketIO on server side when the connection failed
        socket.once("connect_error", (err) => {
            console.log(err.message);

            // Remove the failed socket so that a future attempt can create a new one
            socket = null;

            // Reject the promise with the error the server sent via "next(new Error())"
            reject(err);
        });
    });
}

// Return the client socket if the connection with server succeeded; return null otherwise 
function getSocket() {
    return socket;
}

export { 
    connectSocket,
    getSocket
};