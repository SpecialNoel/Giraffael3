// get-username-handler.js

import { fetchUsername } from "../../../services/db-services/user/fetch-username-service.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleGetUsername(req, res) {
    try {
        const userObjectId = req.user.userObjectId;

        const username = await fetchUsername(userObjectId);
        if (username === null) {
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
                    username
                },
                "Fetch username success."
            )
        );       
    } catch (err) {
        console.error(err);
        return res.status(500).json(
            errorResponse(
                "OTHER",
                "Failed to fetch username."
            )
        );    
    }
}

export { handleGetUsername };