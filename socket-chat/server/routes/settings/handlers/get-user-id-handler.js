// get-user-id-handler.js

import { fetchUserId } from "../../../services/db-services/user/fetch-user-id-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleGetUserId(req, res) {
    try {
        const userObjectId = req.user.userObjectId;

        const userId = await fetchUserId(userObjectId);
        if (userId === null) {
            return res.status(404).json(
                errorResponse(
                    "USER_NOT_FOUND",
                    "User not found."
                )
            );           
        }

        return res.status(200).json(
            successResponse(
                {
                    userId
                },
                "Fetch user id success."
            )
        );       
    } catch (err) {
        console.error(err);
        return res.status(500).json(
            errorResponse(
                "OTHER",
                "Failed to fetch user id."
            )
        );    
    }
} 

export { handleGetUserId };