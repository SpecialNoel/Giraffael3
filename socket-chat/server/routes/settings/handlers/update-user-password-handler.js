// update-user-password-handler.js

import { validatePasswordFormat } from "../../../utils/password-format-validator.js";
import { fetchUserPassword } from "../../../services/db-services/user/fetch-user-password-service.js";
import { hashPassword, comparePassword } from "../../../utils/password-handler.js";
import { updateUserPassword } from "../../../services/db-services/user/update-user-services.js";
import { successResponse, errorResponse } from "../../../utils/api-response.js";

async function handleUpdateUserPassword(req, res) {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const userObjectId = req.user.userObjectId;

        // Validate the format of the received new password
        const validateResult = validatePasswordFormat(newPassword); 
        if (!validateResult.success) {
            return res.status(422).json(
                errorResponse(
                    "PASSWORD_UPDATE_FAILURE",
                    validateResult.message
                )
            );
        }
        
        // Compare new password with the confirm new password
        if (newPassword != confirmNewPassword) {
            return res.status(422).json(
                errorResponse(
                    "PASSWORD_UPDATE_FAILURE",
                    "Passwords do not match."
                )
            );
        }

        // Fetch the user's old password (hash) from database
        const passwordHashOnFile = await fetchUserPassword(userObjectId);
        if (passwordHashOnFile === null) {
            return res.status(404).json(
                errorResponse(
                    "USER_NOT_FOUND",
                    "User not found."
                )
            );           
        }

        // Check the correctness of current password
        // Send error response if the current password does not match the one on file
        if (!await comparePassword(currentPassword, passwordHashOnFile)) {
            return res.status(401).json(
                errorResponse(
                    "PASSWORD_UPDATE_FAILURE",
                    "Current password is incorrect."
                )
            );
        }

        // Check whether the new password match the current password by comparing their hashes
        // Send error response if the new password is the same as the one on file
        if (await comparePassword(newPassword, passwordHashOnFile)) {
            return res.status(422).json(
                errorResponse(
                    "PASSWORD_UPDATE_FAILURE",
                    "New password must be different from your current password."
                )
            );
        }

        // Hash the new password
        const newPasswordHash = await hashPassword(newPassword);

        // Update the database
        const updateResult = await updateUserPassword(userObjectId, newPasswordHash);
        if (!updateResult) {
            return res.status(404).json(
                errorResponse(
                    "USER_NOT_FOUND",
                    "User not found."
                )
            );        
        }
        
        return res.status(200).json(
            successResponse(
                {},
                "Password updated successfully."
            )
        );       
    } catch (err) {
        console.error(err);
        return res.status(500).json(
            errorResponse(
                "OTHER",
                "Failed to update password."
            )
        );    
    }
}

export { handleUpdateUserPassword };