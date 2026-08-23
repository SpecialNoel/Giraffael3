// sign-up-routes.js

import express from "express";

import { sendHTMLFile } from "../route-helper.js";
import { handleSignUp } from "./sign-up-handler.js";

const router = express.Router();

// Sign-up page
router.get("/", (req, res) => {
    sendHTMLFile(res, "sign-up.html");
});
router.post("/", async (req, res) => {
    return await handleSignUp(req, res);
});

export { router };