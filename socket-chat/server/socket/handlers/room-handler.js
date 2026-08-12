// room-handler.js

import { addUserToRoom } from "../../services/redis-services/user-services.js";
import { getMembersInRoom } from "../../services/db-services/membership/get-members-service.js";
import { getPaginatedConversation } from "../../services/db-services/message/get-conversation-service.js";
import { broadcastUserJoined, broadcastUserLeft } from "../emitters/room-broadcaster.js";
import { getRoomInfo } from "../../services/db-services/room/get-room-info-service.js";

async function registerJoinRoomHandler(redis, socket, roomCode) {
    // Leave the user from the room if they are already in the room to prevent duplicated join
    if (socket.activeRoomCode) socket.leave(socket.activeRoomCode);

    // Join the user to the room
    socket.activeRoomCode = roomCode;
    socket.join(roomCode);

    // Add the user to the room in Redis
    await addUserToRoom(redis, roomCode, socket.user.userId);
    console.log(`Added user ${socket.user.userId} to room in Redis`);

    // Notify the user about join room success
    const members = await getMembersInRoom(roomCode);
    broadcastUserJoined(socket, roomCode, members);
    console.log(`Notified all users in room ${roomCode} about user joined`);
}

async function registerLeaveRoomHandler(socket, roomCode) {
    // Notify every user who joined the room (excluding the leaving user) 
    // about an user leaving the room AFTER they had successfully done so
    const members = await getMembersInRoom(roomCode);
    broadcastUserLeft(socket, roomCode, members);
    console.log(`Notified all users in room ${roomCode} about user left`);
}

async function registerEnterRoomHandler(socket, roomCode, cursor) {
    // Leave the user from the room if they are already in the room to prevent duplicated enter
    if (socket.activeRoomCode) {
        // Stop the user entering the same room if they are currently inside the target room
        if (socket.activeRoomCode == roomCode) return;
        socket.leave(socket.activeRoomCode);
    }

    // Enter the user to the room
    socket.activeRoomCode = roomCode;
    socket.join(roomCode);

    // Fetch users with active membership and conversation of the room
    const members = await getMembersInRoom(roomCode);
    const conversationResponse = await getPaginatedConversation(roomCode, cursor);
    const messages = conversationResponse.messages;
    const nextCursor = conversationResponse.nextCursor;
    const hasMore = conversationResponse.hasMore;

    // Fetch room info
    const roomInfo = await getRoomInfo(roomCode);

    const data = {
        members,
        messages,
        nextCursor,
        hasMore,
        roomInfo
    }

    // Send these information to the user
    socket.emit("userEntered", data);
}

async function registerExitRoomHandler(socket, roomCode) {
    console.log(`User ${socket.user.userId} exited room`);
}

export { registerJoinRoomHandler,
         registerLeaveRoomHandler,
         registerEnterRoomHandler,
         registerExitRoomHandler };