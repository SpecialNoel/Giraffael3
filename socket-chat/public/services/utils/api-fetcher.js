// api-fetcher.js

// Send the HTTP request, with the JWT token, to server, and receive
// an HTTP response from the server
async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers 
        }
    });
}

export { apiFetch };