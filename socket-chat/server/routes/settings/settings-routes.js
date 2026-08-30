// settings-routes.js

import express from "express";

import { sendHTMLFile } from "../route-helper.js";
import { authenticateHTTP } from "../../middleware/authenticate-http.js";
import { fetchUsername } from "../../services/db-services/user/fetch-username-service.js";
import { updateUsername, updateUserPassword } from "../../services/db-services/user/update-user-service.js";
import { fetchUserId } from "../../services/db-services/user/fetch-user-id-service.js";
import { fetchUserEmail } from "../../services/db-services/user/fetch-user-email-service.js";
import { successResponse, errorResponse } from "../../utils/api-response.js";
import { validatePasswordFormat } from "../../utils/password-format-validator.js";
import { hashPassword, comparePassword } from "../../utils/password-handler.js";
import { fetchUserPassword } from "../../services/db-services/user/fetch-user-password-service.js";

const router = express.Router();

// Settings page
router.get("/", (req, res) => {
    sendHTMLFile(res, "settings.html");
});
router.get("/username", authenticateHTTP, async (req, res) => {
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
});
router.patch("/username", authenticateHTTP, async (req, res) => {
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
});
router.get("/user-id", authenticateHTTP, async (req, res) => {
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
});
router.get("/user-email", authenticateHTTP, async (req, res) => {
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
});
router.patch("/password", authenticateHTTP, async (req, res) => {
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
});

export { router };