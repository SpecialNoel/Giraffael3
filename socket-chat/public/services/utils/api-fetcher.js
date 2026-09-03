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

export { apiFetch };