// join-room-handler.js

import { joinRoom } from "../../services/db-services/membership/join-room-service.js";

async function handleJoinRoom(req, res) {
    try {
        // Receive room code and user info
        const { roomCode, role } = req.body;
        const userObjectId = req.user.userObjectId;

        // Join the room
        const joinRoomResult = await joinRoom(userObjectId, roomCode, "member");
        
        // Handle join-room failure
        if (!joinRoomResult.success) {
            switch (joinRoomResult.reason) {
                case "ALREADY_IN_ROOM":
                    return res.status(409).json({
                        success: false,
                        error: "User already in room",
                    });
                case "ROOM_NOT_FOUND":
                    return res.status(404).json({
                        success: false,
                        error: "Room not found",
                    });
                default: 
                    return res.status(500).json({
                        success: false,
                        error: "Join room failure",
                    });
            }
        }

        // Retrieve necessary info about this room
        const room = joinRoomResult.room;
        const roomInfo = { roomName: room.roomName, 
                            roomCode: room.roomCode, 
                            creator:  room.creator, 
                            members:  room.members };
        const isCreatorOfRoom = userObjectId.toString() === room.creator.toString();
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
            error: "Internal server error"
        });    
    }
}

export { handleJoinRoom };