// api-fetcher.js

// Send the HTTP request to server, and receive an HTTP response from the server
async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });
    if (response.status !== 401) return response;

    console.log("Access token expired — attempting refresh");

    // Access token expired.
    const refreshResponse = await fetch("/auth/refresh",
        {
            method: "POST",
            credentials: "include"
        }
    );
    if (!refreshResponse.ok) {
        // Refresh token has expired or is invalid.
        // User needs to log in again.
        throw new Error("Authentication required");
    }

    // The server has set a new accessToken cookie.
    // Retry the original request.
    return fetch(url, {
        ...options,
        credentials: "include",
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