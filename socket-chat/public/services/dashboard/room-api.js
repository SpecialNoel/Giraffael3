// room-api.js

import { apiFetch } from "../utils/api.js";

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

// Send "get room info" HTTP request to server, then receive an HTTP response from server
async function getRoomInfo(roomCode) {
    return await apiFetch(`/rooms/${roomCode}/room-info`);
}

// Send "get rooms info" HTTP request to server, then receive an HTTP response from server
async function getRoomsInfo() {
    return await apiFetch(`/rooms`);
}

// Send "fetch some messages" HTTP request to server, then receive an HTTP response from server
async function fetchOlderMessages(roomCode, cursor) {
    return await apiFetch(`/rooms/${roomCode}/messages?cursor=${cursor}`);
}

export { 
    createRoom, 
    deleteRoom, 
    joinRoom, 
    leaveRoom, 
    getRoomInfo, 
    getRoomsInfo,
    fetchOlderMessages 
};