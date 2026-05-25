// signup-routes.js

import express from "express";
import path from "node:path";
import pathToViewsDir from "./route-helper.js";

import findUserInDB from "../db-operations/user-finder.js";
import hashPassword from "../utilities/password-hasher.js";
import createUser from "../db-operations/user-generator.js";

const router = express.Router();

// Sign-up page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "signup.html"));
});
router.post("/", async (req, res) => {
    try {
        // Receive email and plaintext password from user as sign-up credentials
        const { userEmail, userPassword } = req.body;

        // Handle invalid credentials
        if (!userEmail || !userPassword) {
            return res.status(400).json({
                error: "Missing credentials"
            });
        }

        // Check account existence in DB based on user email
        const userInDB = await findUserInDB(userEmail);

        // Received email already associated with an existing account
        if (userInDB) {
            return res.status(409).json({
                error: "User already exists"
            }); // server received duplicated info
        }

        // Hash the received password
        const hashedPassword = await hashPassword(userPassword);

        // Create user in DB
        const user = await createUser(userEmail, hashedPassword);
        console.log("Created user:", user.id);

        return res.status(201).json({
            success: true,
            message: "Account created"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});

export default router;