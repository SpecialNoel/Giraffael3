// room-handler.js

import { getMembersInRoom } from "../../db-services/membership/get-members-in-room-service.js";
import { getPaginatedConversation } from "../../db-services/message/get-paginated-conversation-service.js";
import { getRoomInfo } from "../../db-services/room/get-room-info-service.js";

import { validateRoomCodeFormat } from "../../../../shared/validation/room-code-format-validator.js";

async function registerEnterRoomHandler(socket, roomCode, cursor) {
    // Validate input format (cursor will be validated later)
    const normalizedRoomCode = roomCode.trim();
    const roomCodeFormatValidnessResult = validateRoomCodeFormat(normalizedRoomCode);
    if (!roomCodeFormatValidnessResult.success) {
        socket.emit("enterRoomFailureInvalidRoomCodeFormat", roomCodeFormatValidnessResult.message)
    }

    // Leave the user from the room if they are already in the room to prevent duplicated enter
    if (socket.activeRoomCode) {
        // Stop the user entering the same room if they are currently inside the target room
        if (socket.activeRoomCode === roomCode) return;
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

export { registerEnterRoomHandler,
         registerExitRoomHandler };