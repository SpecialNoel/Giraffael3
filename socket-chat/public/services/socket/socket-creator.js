// socket-creator.js

// Create a socket and establish connection with server socket
function connectSocket() {
    /* 
    * Create the socket, which tries to connect with server side socket via SocketIO
    * Note that the current usage of io() assumes that both frontend and backend are running on the same server
    * 
    * With "withCredentials", client will send the JWT token stored as cookie inside browser to server during connection
    * 
    * With "reconnection", automatic reconnection will be triggered if this socket got destroyed.
    * Server side middleware (i.e. io.use(async (socket, next))) will run for the new connection
    */
    const socket = io({
        withCredentials: true,
        reconnection: true
    });

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

export { 
    connectSocket
};