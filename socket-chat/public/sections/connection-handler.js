// connection-handler.js

// Connect to server via Socket.IO
function connect(credentials) {
	return new Promise((resolve, reject) => {
		// io() by default tries to connect the client to the host/server
		// that serves the page (this home page in this case)
		const socket = io({
			auth: credentials
		});

		// Return the socket if this connection is a success
		socket.once("connect", () => {
			console.log("Connected to server.");
			resolve(socket);
		});
		socket.once("connect_error", (err) => {
			console.error(err);
			reject(err);
		});
	});
}

export default connect;
