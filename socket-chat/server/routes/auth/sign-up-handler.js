// sign-up-handler.js

import { findUserByEmail } from "../../services/db-services/user/find-user-by-email-service.js";
import { createUser } from "../../services/db-services/user/create-user-service.js";
import { hashPassword } from "../../utils/password-handler.js";
import { successResponse, errorResponse } from "../../utils/api-response.js";

import { validateEmailFormat } from "../../../shared/validation/email-format-validator.js";
import { validatePasswordFormat } from "../../../shared/validation/password-format-validator.js";

async function handleSignUp(req, res) {
    try {
        // Receive email and plaintext password from user as sign-up credentials
        const { email, plainPassword } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        // Validate input formats
        const emailFormatValidnessResult = validateEmailFormat(normalizedEmail);
        if (!emailFormatValidnessResult.success) {
            return res.status(400).json(
                errorResponse(
                    "INVALID_CREDENTIALS_FORMAT",
                    emailFormatValidnessResult.message // explain in detail for account registration
                )
            );
        }
        const passwordFormatValidnessResult = validatePasswordFormat(plainPassword);
        if (!passwordFormatValidnessResult.success) {
            return res.status(400).json(
                errorResponse(
                    "INVALID_CREDENTIALS_FORMAT",
                    passwordFormatValidnessResult.message // explain in detail for account registration
                )
            );
        }

        // Check account existence in DB based on user email
        const userInDB = await findUserByEmail(normalizedEmail);
        if (userInDB) {
            // Handle error where received email already associated with an existing account
            return res.status(409).json(
                errorResponse(
                    "USER_ALREADY_EXISTS",
                    "User already exists" // explain in detail for account registration
                )
            ); // server received duplicated info
        }

        // Hash the received password
        const passwordHash = await hashPassword(plainPassword);

        // Create user in DB
        const user = await createUser(normalizedEmail, passwordHash);
        console.log("Created user:", user._id);

        // Signup success
        return res.status(201).json(
            successResponse(
                {},
                "Account created"
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

export { handleSignUp };