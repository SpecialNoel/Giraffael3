// sign-in-routes.js

import express from "express";
import path from "node:path";

import { pathToViewsDir } from "./route-helper.js";
import { findUser } from "../db-services/user-services.js";
import { hashPassword } from "../utils/password-handler.js";
import { comparePassword } from "../utils/password-handler.js";
import { generateToken } from "../utils/jwt-token-handler.js";

const router = express.Router();

// Sign-in page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "sign-in.html"));
});
router.post("/", async (req, res) => {
    try {
        // Receive email and plaintext password from user as sign-in credentials
        const { email, plainPassword } = req.body;

        // Check account existence in DB based on user email
        const user = await findUser(email);

        // Handle error where the account associated with the received email does not exist in DB
        if (!user) {
            console.log(`Email does not exist in DB: ${email}`);
            return res.status(401).json({ 
                error: "Invalid credentials"
            });
        }
        
        // Compare the received plain password with the record found in DB
        const isPasswordValid = await comparePassword(plainPassword, user.passwordHash);
        console.log("isPasswordValid: ", isPasswordValid);

        // Handle error where the password does not match the one stored in DB
        if (!isPasswordValid) {
            console.log(`Invalid login attempt for email: ${email}`);
            return res.status(401).json({ 
                error: "Invalid credentials"
            });
        }

        // Generate a JWT (JSON Web Token) for this user for both authentication and authorization
        const token = generateToken(user._id);

        // Signin success
        return res.status(200).json({
            success: true,
            message: "Sign in success",
            email: email,
            _id: user._id,
            token: token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });    
    }
});

export { router };