// sign-in-handler.js

import { findUserByEmail } from "../../services/db-services/user/find-user-service.js";
import { comparePassword } from "../../utils/password-handler.js";
import { generateToken } from "../../utils/jwt-token-handler.js";
import { successResponse, errorResponse } from "../../utils/api-response.js";

async function handleSignIn(req, res) {
    try {
        /* 
         * Receive email and plaintext password from user as sign-in credentials
         * Note that at this stage, server cannot access attributes attached to client's
         *   socket yet since client does not have the token yet (the token will be generated
         *   by server below, which will then be sent to client as part of sign-in success)
         * TLDR: token verification comes after sign-in.
        */
        const { email, plainPassword } = req.body;

        // Try to find user from database using received email
        const user = await findUserByEmail(email);
        // Handle error where the account associated with the received email does not exist in DB
        if (!user) {
            console.log(`Email does not exist in DB: ${email}`);
            return res.status(401).json(
                errorResponse(
                    "INVALID_CREDENTIALS",
                    "Invalid email or password"
                )
            );
        }
        
        // Compare the received plain password with the record found in DB
        const isPasswordValid = await comparePassword(plainPassword, user.passwordHash);
        if (!isPasswordValid) {
            // Handle error where the password does not match the one stored in DB
            console.log(`Invalid login attempt for email: ${email}`);
            return res.status(401).json(
                errorResponse(
                    "INVALID_CREDENTIALS",
                    "Invalid email or password"
                )
            );
        }

        // Generate a JWT (JSON Web Token) for this user for authentication purpose only
        const token = generateToken(user._id, user.userId);

        // Set the JWT token as an HTTP-Only cookie in the user's browser
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            secure: true,
            sameSite: "lax",
            maxAge: 60*60*1000,
            path: "/"
        });

        // Signin success
        return res.status(200).json(
            successResponse(
                {},
                "Sign in success"
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

export { handleSignIn };