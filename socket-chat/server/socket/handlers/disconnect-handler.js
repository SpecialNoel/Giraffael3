// disconnect-handler.js

import { removeUserFromRoom } from "../../services/redis-services/user-services.js";

async function registerDisconnectHandler(redis, socket) {
    // Handle the disconnection event
    if (!socket.activeRoomCode) {
        console.log("User tries to disconnect while they are not inside a room yet\n");
        return;
    }

    // Remove the user from the room in Redis
    const userId = socket.user.userId;
    await removeUserFromRoom(redis, socket.activeRoomCode, userId);
    console.log(`Removed user ${socket.user.userId} from room in Redis`);

    socket.leave(socket.activeRoomCode);
    socket.activeRoomCode = null;
    console.log(`User ${socket.user.userId} left room ${socket.activeRoomCode}`);
    console.log(`User ${socket.user.userId} disconnected`);
}

export { registerDisconnectHandler };