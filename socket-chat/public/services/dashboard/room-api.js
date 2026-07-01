// room-api.js

import { apiFetch } from "../utils/api-fetcher.js";

// Send "create room" HTTP request to server, then receive an HTTP response from server
async function createRoom(roomName) {
    return await apiFetch("/rooms/create", {
        method: "POST",
        body: JSON.stringify({ roomName })
    });
}

// Send "delete room" HTTP request to server, then receive an HTTP response from server
async function deleteRoom(roomCode) {
    return await apiFetch("/rooms/delete", {
        method: "POST",
        body: JSON.stringify({ roomCode })
    });
}

// Send "join room" HTTP request to server, then receive an HTTP response from server
async function joinRoom(roomCode) {
    return await apiFetch("/rooms/join", {
        method: "POST",
        body: JSON.stringify({ roomCode })
    });
}

// Send "leave room" HTTP request to server, then receive an HTTP response from server
async function leaveRoom(roomCode) {
    return await apiFetch("/rooms/leave", {
        method: "POST",
        body: JSON.stringify({ roomCode })
    });
}

export { createRoom, deleteRoom, joinRoom, leaveRoom };