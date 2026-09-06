// settings-routes.js

import express from "express";

import { sendHTMLFile } from "../route-helper.js";
import { authenticateHTTP } from "../../middleware/authenticate-http.js";

import { handleGetUsername } from "./handlers/get-username-handler.js";
import { handleUpdateUsername } from "./handlers/update-username-handler.js";
import { handleGetUserId } from "./handlers/get-user-id-handler.js";
import { handleGetUserEmail } from "./handlers/get-user-email-handler.js";
import { handleUpdateUserPassword } from "./handlers/update-user-password-handler.js";

const router = express.Router();

// Settings page
router.get("/", authenticateHTTP, (req, res) => {
    sendHTMLFile(res, "settings.html");
});
router.get("/username", authenticateHTTP, async (req, res) => {
    return await handleGetUsername(req, res);
});
router.patch("/username", authenticateHTTP, async (req, res) => {
    return await handleUpdateUsername(req, res);
});
router.get("/user-id", authenticateHTTP, async (req, res) => {
    return await handleGetUserId(req, res);
});
router.get("/user-email", authenticateHTTP, async (req, res) => {
    return await handleGetUserEmail(req, res);
});
router.patch("/password", authenticateHTTP, async (req, res) => {
    return await handleUpdateUserPassword(req, res);
});

export { router };