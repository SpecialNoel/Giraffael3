// response-parser.js

// Retrieves data contained in server HTTP response
async function parseResponse(response) {
    // Convert retrieved response received from server to json
    const data = await response.json();

    // Display the error message to the user if the operation fails
    if (!response.ok) {
        const err = new Error(data.error);
        err.status = response.status;
        err.code = data.code;
        throw err;
    }

    return data;
}

export { parseResponse };