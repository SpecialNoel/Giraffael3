// delete-room-handler.js

import { deleteRoom } from "../../../services/db-services/room/delete-room-service.js";
import { isCreatorByRoomCode } from "../../../services/db-services/membership/check-creator-service.js";
import { broadcastRoomDeleted } from "../../../socket/emitters/room-broadcaster.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleDeleteRoom(req, res, io) {
    try {
        // Receive room name and user info
        const { roomCode } = req.body;
        const userObjectId = req.user.userObjectId;

        // Handle case where received userObjectId does not match the room's creator id
        if (!isCreatorByRoomCode(userObjectId, roomCode)) {
            return res.status(401).json(
                errorResponse(
                    "NOT_CREATOR",
                    "Delete room failure"
                )
            );
        }

        // Broadcast the room deletion to all users who joined this room via socket events BEFORE actual room deletion
        broadcastRoomDeleted(io, roomCode);
        console.log(`Notified all users in room ${roomCode} about room deletion`);

        // Delete the room from the database
        const deletedAt = await deleteRoom(roomCode);

        // Delete-room success
        return res.status(200).json(
            successResponse(
                {
                    deletedAt
                },
                "Delete room success"
            )
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json(
            errorResponse(
                "OTHER",
                "Internal server error"
            )
        );  
    }
}

export { handleDeleteRoom };