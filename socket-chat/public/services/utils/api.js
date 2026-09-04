// api-fetcher.js

// Send the HTTP request to server, and receive an HTTP response from the server
async function apiFetch(url, options = {}) {
    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });
}

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

export { apiFetch, parseResponse };