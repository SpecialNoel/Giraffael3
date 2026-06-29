// sign-in-handler.js

import { findUserByEmail } from "../../services/db-services/user/find-user-service.js";
import { comparePassword } from "../../utils/password-handler.js";
import { generateToken } from "../../utils/jwt-token-handler.js";

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
            return res.status(401).json({ 
                success: false,
                code: "USER_NOT_FOUND",
                error: "User not found"
            });
        }
        
        // Compare the received plain password with the record found in DB
        const isPasswordValid = await comparePassword(plainPassword, user.passwordHash);

        // Handle error where the password does not match the one stored in DB
        if (!isPasswordValid) {
            console.log(`Invalid login attempt for email: ${email}`);
            return res.status(401).json({ 
                success: false,
                code: "INVALID_CREDENTIALS",
                error: "Invalid credentials"
            });
        }

        // Generate a JWT (JSON Web Token) for this user for both authentication and authorization
        const token = generateToken(user._id, user.userId);

        // Signin success
        return res.status(200).json({
            success: true,
            message: "Sign in success",
            userId: user.userId,
            token: token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            code: "OTHER",
            error: "Internal server error"
        });    
    }
}

export { handleSignIn };