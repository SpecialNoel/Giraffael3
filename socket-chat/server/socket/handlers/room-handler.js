// room-handler.js

import { addUserToRoom } from "../../services/redis-services/user-services.js";
import { getMembersInRoom } from "../../services/db-services/membership/get-members-service.js";
import { getMessages } from "../../services/db-services/message/get-messages-service.js";
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
    const onlineUsers = await getMembersInRoom(roomCode);
    socket.emit("userJoined", onlineUsers);
}

async function registerEnterRoomHandler(socket, roomCode) {
    // Leave the user from the room if they are already in the room to prevent duplicated join
    if (socket.currentRoomCode) socket.leave(socket.currentRoomCode);

    // Join the user to the room
    socket.currentRoomCode = roomCode;
    socket.join(roomCode);

    // Fetch online users and message history of the room
    const onlineUsers = await getMembersInRoom(roomCode);
    const messages = await getMessages(roomCode);
    // Fetch room displaying info
    const roomInfoForDisplay = await getRoomInfoForDisplay(roomCode);

    // Send these information to the user
    socket.emit("userEntered", {
        onlineUsers,
        messages,
        roomInfoForDisplay
    });
}

async function registerExitRoomHandler(socket, roomCode) {
    console.log(`User ${socket.user.userId} exited room`);
}

export { registerJoinRoomHandler,
         registerEnterRoomHandler,
         registerExitRoomHandler };