// room-handler.js

import { addUserToRoom } from "../../services/redis-services/user-services.js";
import { getMembersInRoom } from "../../services/db-services/membership/get-members-service.js";
import { getConversation } from "../../services/db-services/message/get-conversation-service.js";
import { broadcastUserLeft } from "../emitters/room-broadcaster.js";
import { getRoomInfoForDisplay } from "../../services/db-services/room/get-room-info-for-display-service.js";

async function registerJoinRoomHandler(io, redis, socket, roomCode) {
    // Leave the user from the room if they are already in the room to prevent duplicated join
    if (socket.currentRoomCode) socket.leave(socket.currentRoomCode);

    // Join the user to the room
    socket.currentRoomCode = roomCode;
    socket.join(roomCode);

    // Add the user to the room in Redis
    await addUserToRoom(redis, roomCode, socket.user.userId);
    console.log(`Added user ${socket.user.userId} to room in Redis`);

    // Notify the user about join room success
    const memberList = await getMembersInRoom(roomCode);
    socket.emit("userJoined", memberList);
}

async function registerLeaveRoomHandler(socket, roomCode) {
    // Notify every user who joined the room (excluding the leaving user) 
    // about an user leaving the room AFTER they had successfully done so
    const memberList = await getMembersInRoom(roomCode);
    broadcastUserLeft(socket, roomCode, memberList);
    console.log(`Notified all users in room ${roomCode} about user left`);
}

async function registerEnterRoomHandler(socket, roomCode) {
    // Leave the user from the room if they are already in the room to prevent duplicated join
    if (socket.currentRoomCode) socket.leave(socket.currentRoomCode);

    // Enter the user to the room
    socket.currentRoomCode = roomCode;
    socket.join(roomCode);

    // Fetch active users and conversation of the room
    const memberList = await getMembersInRoom(roomCode);
    const conversation = await getConversation(roomCode);
    // Fetch room displaying info
    const roomInfoForDisplay = await getRoomInfoForDisplay(roomCode);

    // Send these information to the user
    socket.emit("userEntered", {
        memberList,
        conversation,
        roomInfoForDisplay
    });
}

async function registerExitRoomHandler(socket, roomCode) {
    console.log(`User ${socket.user.userId} exited room`);
}

export { registerJoinRoomHandler,
         registerLeaveRoomHandler,
         registerEnterRoomHandler,
         registerExitRoomHandler };