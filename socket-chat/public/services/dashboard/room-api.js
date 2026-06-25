// room-api.js

import { apiFetch } from "../utils/api-fetcher.js";

async function createRoom(roomName) {
    const response = await apiFetch("/rooms/create", {
        method: "POST",
        body: JSON.stringify({ roomName })
    });

    return response;
}

async function deleteRoom(roomCode) {
    const response = await apiFetch("/rooms/delete", {
        method: "POST",
        body: JSON.stringify({ roomCode })
    });

    return response;
}

async function joinRoom(roomCode) {
    const response = await apiFetch("/rooms/join", {
        method: "POST",
        body: JSON.stringify({ roomCode })
    });

    return response;
}

async function leaveRoom(roomCode) {
    const response = await apiFetch("/rooms/leave", {
        method: "POST",
        body: JSON.stringify({ roomCode })
    });

    return response;
}

export { createRoom, deleteRoom, joinRoom, leaveRoom };