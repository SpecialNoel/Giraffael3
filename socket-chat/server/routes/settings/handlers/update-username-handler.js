// update-username-handler.js

import { updateUsername } from "../../../services/db-services/user/update-user-services.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleUpdateUsername(req, res) {
    try {
        const { username } = req.body;
        const userObjectId = req.user.userObjectId;

        // Validate the received username
        if (!username || username.trim() === "") {
            return res.status(400).json(
                errorResponse(
                    "USERNAME_UPDATE_FAILURE",
                    "Username cannot be empty."
                )
            );
        }

        // Update the user's username in MongoDB
        const updatedUsername = await updateUsername(userObjectId, username);
        if (!updatedUsername) {
            return res.status(500).json(
                errorResponse(
                    "USERNAME_UPDATE_FAILURE",
                    "Failed to update username."
                )
            );            
        }

        return res.status(200).json(
            successResponse(
                {
                    username: updatedUsername.username
                },
                "Username updated successfully."
            )
        );       
    } catch (err) {
        console.error(err);
        return res.status(500).json(
            errorResponse(
                "OTHER",
                "Failed to update username"
            )
        );    
    }
}

export { handleUpdateUsername };