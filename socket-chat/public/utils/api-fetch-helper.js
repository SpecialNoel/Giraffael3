// api-fetch-helper.js

// Send the original request to server
async function sendRequestToServer(url, options = {}) {
    return await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });
}

// Explain the failure of the original request caused by access token
async function explainAccessTokenError(response) {
    const errorBody = await response.json();
    const errorCode = errorBody?.error?.code;
    if (errorCode == "MISSING_ACCESS_TOKEN") {
        console.log("Access token missing — attempting refresh");
    } else if (errorCode == "EXPIRED_ACCESS_TOKEN") {
        console.log("Access token expired — attempting refresh");
    } else if (errorCode == "INVALID_ACCESS_TOKEN") {
        console.log("Access token invalid — attempting refresh");
    } else {
        console.log("Access token not accepted by other reasons — attempting refresh");
    }
}

// Send a refresh request to server
async function sendRefreshRequestToServer() {
    return await fetch("/signin/refresh",
        {
            method: "POST",
            credentials: "include"
        }
    );
}

// Explain the failure of the refresh request, then redirect user to sign-in page
async function handleRefreshTokenError(response) {
    const errorBody = await response.json();
    const errorCode = errorBody?.error?.code;
    if (errorCode == "MISSING_REFRESH_TOKEN") {
        console.log("Refresh failed: refresh token missing");
    } else if (errorCode == "EXPIRED_REFRESH_TOKEN") {
        console.log("Refresh failed: refresh token expired");
    } else if (errorCode == "INVALID_REFRESH_TOKEN") {
        console.log("Refresh failed: refresh token invalid");
    } else {
        console.log("Refresh failed.");
    }

    // Redirect user to sign-in page
    alert("Your session has expired. Please sign in again.");
    window.location.href = "/signin";
}

export {
    sendRequestToServer,
    explainAccessTokenError,
    sendRefreshRequestToServer,
    handleRefreshTokenError,
}