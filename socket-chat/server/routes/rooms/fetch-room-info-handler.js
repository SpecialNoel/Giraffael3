// fetch-room-info-handler.js

import { getRoomsInfo } from "../../services/db-services/membership/get-rooms-info-service.js";

async function handleFetchRoomInfo(req, res) {
    try {
        // Retrieve userObjectId of the requesting user 
        const userObjectId = req.user.userObjectId;

        // Retrieve the info about all existing rooms this user has joined
        const roomsInfo = await getRoomsInfo(userObjectId);
        
        // Return the list of room info
        return res.status(200).json({
            success: true,
            message: "Fetch rooms success",
            roomsInfo
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

export { handleFetchRoomInfo };