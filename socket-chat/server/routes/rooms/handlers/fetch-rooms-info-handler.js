// fetch-rooms-info-handler.js

import { getRoomsInfo } from "../../../services/db-services/membership/get-rooms-info-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleFetchRoomsInfo(req, res) {
    try {
        // Retrieve userObjectId of the requesting user 
        const userObjectId = req.user.userObjectId;

        // Retrieve the info about all existing rooms this user has joined
        const roomsInfo = await getRoomsInfo(userObjectId);
        
        // Return the list of room info
        return res.status(200).json(
            successResponse(
                {
                    roomsInfo
                },
                "Fetch rooms success"
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

export { handleFetchRoomsInfo };