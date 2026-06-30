// join-room-handler.js

import { joinRoom } from "../../services/db-services/membership/join-room-service.js";
import { getRoomInfo } from "../../services/db-services/room/get-room-info-service.js";
import { isCreatorByRoomCode } from "../../services/db-services/membership/check-creator-service.js";

async function handleJoinRoom(req, res) {
    try {
        // Receive room code and user info
        const { roomCode } = req.body;
        const userObjectId = req.user.userObjectId;

        // Join the room
        const joinRoomResult = await joinRoom(userObjectId, roomCode, "member");
        
        // Handle join-room failure
        if (!joinRoomResult.success) {
            switch (joinRoomResult.reason) {
                case "ALREADY_IN_ROOM":
                    return res.status(409).json({
                        success: false,
                        code: "ALREADY_IN_ROOM",
                        error: "User already in room",
                    });
                case "ROOM_NOT_FOUND":
                    return res.status(404).json({
                        success: false,
                        code: "ROOM_NOT_FOUND",
                        error: "Room not found",
                    });
                default: 
                    return res.status(500).json({
                        success: false,
                        code: "OTHER",
                        error: "Join room failure",
                    });
            }
        }

        // Retrieve necessary info about this room
        const newMembership = joinRoomResult.membership;
        const roomInfo = await getRoomInfo(newMembership.roomObjectId);
        const isCreatorOfRoom = isCreatorByRoomCode(userObjectId, roomCode);

        // Join-room success
        return res.status(200).json({
            success: true,
            message: "Join room success",
            roomInfo: roomInfo,
            isCreatorOfRoom: isCreatorOfRoom
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            code: "OTHER",
            error: "Internal server error"
        });    
    }
}

export { handleJoinRoom };