// api-fetcher.js

// Send the HTTP request to server, and receive an HTTP response from the server
async function apiFetch(url, options = {}) {
    console.log("========== apiFetch START ==========");
    console.log("URL:", url);

    const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    console.log("Original request response:", response.status);
    if (response.status !== 401) {
        console.log("========== apiFetch END ==========");
        return response;
    }

    // Status code 401 usually denote incorrect credentials. Since access token expiration
    // is considered one of the reason of incorrect credentials, when the client receives 
    // a response with status code 401, they should have their access token refreshed.
    console.log("Access token failed — attempting refresh");

    // Access token expired.
    const refreshResponse = await fetch("/signin/refresh",
        {
            method: "POST",
            credentials: "include"
        }
    );
    console.log("Refresh request response:", refreshResponse.status);
    if (!refreshResponse.ok) {
        // Refresh token has expired or is invalid.
        // User needs to log in again.
        console.log("Refresh failed");
        throw new Error("Authentication required for invalid refresh token");
    }

    // The server has set a new accessToken cookie.
    // Retry the original request.
    console.log("Refresh succeeded — retrying original request");
    const retryResponse = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });
    console.log("Retry response:", retryResponse.status);
    console.log("Retry body:", await retryResponse.clone().text());
    console.log("========== apiFetch END ==========");
    return retryResponse;
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