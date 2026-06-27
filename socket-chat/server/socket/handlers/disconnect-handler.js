// disconnect-handler.js

import { removeUserFromRoom } from "../../services/redis-services/user-services.js";

async function registerDisconnectHandler(redis, socket) {
    // Handle the disconnection event
    if (!socket.currentRoomCode) {
        console.log("User tries to disconnect while they are not inside a room yet");
    }

    // Remove the user from the room in Redis
    const userId = socket.user.userId;
    await removeUserFromRoom(redis, socket.currentRoomCode, userId);
    console.log(`Removed user ${socket.user.userId} from room in Redis`);

    socket.leave(socket.currentRoomCode);
    socket.currentRoomCode = null;
    console.log(`User ${socket.user.userId} left room ${socket.currentRoomCode}`);
    console.log(`User ${socket.user.userId} disconnected`);
}

export { registerDisconnectHandler };