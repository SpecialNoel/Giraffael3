// create-room-handler.js

import { createRoom } from "../../../services/db-services/room/create-room-service.js";
import { joinRoom } from "../../../services/db-services/membership/join-room-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleCreateRoom(req, res) {
    try {
        // Receive room name and creator info
        const { roomName } = req.body;
        const userObjectId = req.user.userObjectId;

        // Create the room
        const room = await createRoom(roomName, userObjectId);

        // Create membership by join to the room
        const joinRoomResult = await joinRoom(userObjectId, room.roomCode, "creator");

        // Handle join-room failure
        if (!joinRoomResult.success) {
            switch (joinRoomResult.reason) {
                case "ALREADY_IN_ROOM":
                    return res.status(409).json(
                        errorResponse(
                            "ALREADY_IN_ROOM",
                            "User already in room"
                        )
                    );
                case "ROOM_NOT_FOUND":
                    return res.status(404).json(
                        errorResponse(
                            "ROOM_NOT_FOUND",
                            "Room not found"
                        )
                    );
                default: 
                    return res.status(500).json(
                        errorResponse(
                            "OTHER",
                            "Join room failure"
                        )
                    );
            }
        }

        // Retrieve necessary info about this new room
        const roomInfo = { roomName: room.roomName, 
                           roomCode: room.roomCode } ;

        // Create-room success
        return res.status(200).json(
            successResponse(
                {
                    roomInfo,
                    role: "creator"
                },
                "Create room success"
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

export { handleCreateRoom };