// get-user-email-handler.js

import { fetchUserEmail } from "../../../services/db-services/user/fetch-user-email-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleGetUserEmail(req, res) {
    try {
        const userObjectId = req.user.userObjectId;

        const userEmail = await fetchUserEmail(userObjectId);
        if (userEmail === null) {
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
                    userEmail
                },
                "Fetch user email success."
            )
        );       
    } catch (err) {
        console.error(err);
        return res.status(500).json(
            errorResponse(
                "OTHER",
                "Failed to fetch user email."
            )
        );    
    }
}

export { handleGetUserEmail };