// join-room-handler.js

import { joinRoom } from "../../../services/db-services/membership/join-room-service.js";
import { getRoomInfo } from "../../../services/db-services/room/get-room-info-service.js";
import { getMembership } from "../../../services/db-services/membership/get-membership-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";
import { getMembersInRoom } from "../../../services/db-services/membership/get-members-service.js"
import { broadcastUserJoined } from "../../../socket/emitters/room-broadcaster.js";

async function handleRoomMembershipAdded(io, roomCode) {
    // Retrieve necessary info about this room
    const roomInfo = await getRoomInfo(roomCode);
    console.log("roomInfo:", roomInfo);

    // Get every user who joined the room (excluding the leaving user) 
    const members = await getMembersInRoom(roomCode);
    
    // Notify these users about this event
    broadcastUserJoined(io, roomCode, members);
    return roomInfo
}

async function handleJoinRoom(req, res, io) {
    try {
        // Receive room code and user info
        const { roomCode } = req.body;
        const userObjectId = req.user.userObjectId;
        const userId = req.user.userId;

        // Fetch the membership associated with the user public id and room code, if exists
        const membership = await getMembership(userObjectId, roomCode);
        // Fetch the role of this user in the room; assign it as a member if the membership is not existed yet
        const role = membership ? membership.role : "member";

        // Send "join room" request to the server
        const joinRoomResult = await joinRoom(userObjectId, roomCode, role);
        
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

        // Retrieve necessary info about this room, then notify users in the room about this event
        const roomInfo = await handleRoomMembershipAdded(io, roomCode);

        // Join-room success
        return res.status(200).json(
            successResponse(
                {
                    roomInfo,
                    role
                },
                "Join room success"
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

export { handleJoinRoom, handleRoomMembershipAdded };