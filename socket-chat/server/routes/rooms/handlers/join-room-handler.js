// join-room-handler.js

import { joinRoom } from "../../../services/db-services/membership/join-room-service.js";
import { getRoomInfo } from "../../../services/db-services/room/get-room-info-service.js";
import { getMembership } from "../../../services/db-services/membership/get-membership-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";
import { getMembersInRoom } from "../../../services/db-services/membership/get-members-in-room-service.js"
import { broadcastUserJoined } from "../../../services/socket/emitters/room-broadcaster.js";

import { validateRoomCodeFormat } from "../../../../shared/validation/room-code-format-validator.js";

async function handleRoomMembershipAdded(io, normalizedRoomCode) {
    // Retrieve necessary info about this room
    const roomInfo = await getRoomInfo(normalizedRoomCode);
    console.log("roomInfo:", roomInfo);

    // Get every user who joined the room (excluding the leaving user) 
    const members = await getMembersInRoom(normalizedRoomCode);
    
    // Notify these users about this event
    broadcastUserJoined(io, normalizedRoomCode, members);
    return roomInfo;
}

async function handleJoinRoom(req, res, io) {
    try {
        // Receive room code and user info
        const { roomCode } = req.body;
        const userObjectId = req.user.userObjectId;
        const normalizedRoomCode = roomCode.trim();

        // Validate input format
        const roomCodeFormatValidnessResult = validateRoomCodeFormat(normalizedRoomCode);
        if (!roomCodeFormatValidnessResult.success) {
            return res.status(400).json(
                errorResponse(
                    "INVALID_ROOM_CODE_FORMAT",
                    roomCodeFormatValidnessResult.message
                )
            );        
        }

        // Fetch the membership associated with the user public id and room code, if exists
        const membership = await getMembership(userObjectId, normalizedRoomCode);
        // Fetch the role of this user in the room, if they have any previously; 
        // assign it as a member if the membership does not existed yet
        const role = membership ? membership.role : "member";

        // Send "join room" request to the server
        const joinRoomResult = await joinRoom(userObjectId, normalizedRoomCode, role);
        
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
        const roomInfo = await handleRoomMembershipAdded(io, normalizedRoomCode);

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