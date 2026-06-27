// sign-up-handler.js

import { findUserByEmail } from "../../services/db-services/user/find-user-service.js";
import { createUser } from "../../services/db-services/user/create-user-service.js";
import { hashPassword } from "../../utils/password-handler.js";

async function handleSignUp(req, res, PASSWORD_MIN_LENGTH) {
    try {
        // Receive email and plaintext password from user as sign-up credentials
        const { email, plainPassword } = req.body;

        // Handle invalid credentials
        if (!email || !plainPassword) {
            return res.status(400).json({
                error: "Missing credentials"
            });
        }

        // Handle too short passwords
        if (plainPassword.length < PASSWORD_MIN_LENGTH) {
            return res.status(400).json({
                error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
            });
        }

        // Check account existence in DB based on user email
        const userInDB = await findUserByEmail(email);

        // Handle error where received email already associated with an existing account
        if (userInDB) {
            return res.status(409).json({
                error: "User already exists"
            }); // server received duplicated info
        }

        // Hash the received password
        const passwordHash = await hashPassword(plainPassword);

        // Create user in DB
        const user = await createUser(email, passwordHash);
        console.log("Created user:", user._id);

        // Signup success
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
}

export { handleSignUp };