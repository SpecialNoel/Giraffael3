// response-parser.js

// Retrieves data contained in server HTTP response
async function parseResponse(response) {
    // Convert retrieved response received from server to json
    const result = await response.json();

    // Display the error message to the user if the operation fails
    if (!result.success) {
        const err = new Error(result.error.message);
        err.status = response.status;
        err.code = result.error.code;
        throw err;
    }

    return result;
}

export { parseResponse };