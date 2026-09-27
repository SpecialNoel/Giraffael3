// api-fetcher.js

import { 
    sendRequestToServer,
    explainAccessTokenError,
    sendRefreshRequestToServer,
    handleRefreshTokenError,
} from "./api-fetch-helper.js";

// Send the HTTP request to server, and receive an HTTP response from the server
async function apiFetch(url, options = {}) {
    // Send the original request to server
    const response = await sendRequestToServer(url, options);
    console.log("Original request response:", response.status);
    
    // Return the response as is, as long as the status code is not 401 (invalid credential error)
    if (response.status !== 401) return response;

    // Explain the failure of the    request caused by access token
    await explainAccessTokenError(response);

    // Send a refresh tokens request to server
    const refreshResponse = await sendRefreshRequestToServer();

    // Refresh token has expired or is invalid. This means that user needs to log in again.
    if (!refreshResponse.ok) {
        await handleRefreshTokenError(refreshResponse);
        return;
    }

    // The server has successfully refreshed the tokens, and set these new tokens as cookies. 
    // Retry the original request.
    console.log("Tokens refreshed — retrying original request");
    return await sendRequestToServer(url, options);
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