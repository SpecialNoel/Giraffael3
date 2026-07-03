// join-room-handler.js

import { joinRoom } from "../../services/db-services/membership/join-room-service.js";
import { getRoomInfoForDisplay } from "../../services/db-services/room/get-room-info-for-display-service.js";
import { getMembership } from "../../services/db-services/membership/get-membership-service.js";

async function handleJoinRoom(req, res) {
    try {
        // Receive room code and user info
        const { roomCode } = req.body;
        const userObjectId = req.user.userObjectId;

        // Fetch the membership associated with the user public id and room code, if exists
        const membership = await getMembership(userObjectId, roomCode);
        // Fetch the role of this user in the room; assign it as a member if the membership is not existed yet
        const role = membership ? membership.role : "member";

        // Send "join room" request to the server only if the user has never joined to the room before
        if (!membership){
            // Join the room
            const joinRoomResult = await joinRoom(userObjectId, roomCode, role);
            
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
        }

        // Retrieve necessary info about this room
        const roomInfoForDisplay = await getRoomInfoForDisplay(roomCode);
        console.log("roomInfoForDisplay:", roomInfoForDisplay)

        // Join-room success
        return res.status(200).json({
            success: true,
            message: "Join room success",
            roomInfoForDisplay: roomInfoForDisplay,
            role: role
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