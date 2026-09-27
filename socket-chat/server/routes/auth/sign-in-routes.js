// sign-in-routes.js

import express from "express";

import { sendHTMLFile } from "../route-helper.js";
import { handleSignIn } from "./sign-in-handler.js";
import { refreshHTTPTokens } from "./refresh-http-tokens-handler.js";

const router = express.Router();

// Sign-in page
router.get("/", (req, res) => {
    sendHTMLFile(res, "sign-in.html");
});
router.post("/", async (req, res) => {
    return await handleSignIn(req, res);
});
// Refresh the user's access token
// Triggered upon expiration of user's refresh token
router.post("/refresh", (req, res) => {
    console.log("========== REFRESH ROUTE REACHED ==========");
    return refreshHTTPTokens(req, res);
});
export { router };