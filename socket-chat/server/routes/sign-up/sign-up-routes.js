// sign-up-routes.js

import express from "express";
import path from "node:path";

import { sendHTMLFile } from "../route-helper.js";
import { handleSignUp } from "./sign-up-handler.js";

const router = express.Router();

const PASSWORD_MIN_LENGTH = 8;

// Sign-up page
router.get("/", (req, res) => {
    sendHTMLFile(res, "sign-up.html");
});
router.post("/", async (req, res) => {
    return await handleSignUp(req, res, PASSWORD_MIN_LENGTH);
});

export { router };