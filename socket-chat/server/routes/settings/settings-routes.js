// settings-routes.js

import express from "express";

import { sendHTMLFile } from "../route-helper.js";
import { authenticateHTTP } from "../../middleware/authenticate-http.js";
import { fetchUsername } from "../../services/db-services/user/fetch-username-service.js";
import { updateUsername } from "../../services/db-services/user/update-user-service.js";
import { successResponse, errorResponse } from "../../utils/api-response.js";

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
                    "User not found"
                )
            );           
        }

        return res.status(200).json(
            successResponse(
                {
                    username
                },
                "Fetch username success"
            )
        );       
    } catch (err) {
        console.error(err);
        return res.status(500).json(
            errorResponse(
                "OTHER",
                "Failed to fetch username"
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
                    "Failed to update username"
                )
            );            
        }

        return res.status(200).json(
            successResponse(
                {
                    username: updatedUsername.username
                },
                "Update username success"
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

export { router };