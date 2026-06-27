// sign-in-routes.js

import express from "express";
import path from "node:path";

import { sendHTMLFile } from "../route-helper.js";
import { handleSignIn } from "./sign-in-handler.js";

const router = express.Router();

// Sign-in page
router.get("/", (req, res) => {
    sendHTMLFile(res, "sign-in.html");
});
router.post("/", async (req, res) => {
    return await handleSignIn(req, res);
});

export { router };