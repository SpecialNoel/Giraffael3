// signin-router.js

import express from "express";
import path from "node:path";
import pathToViewsDir from "./route-helper.js"

const router = express.Router();

// Sign-in page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "signin.html"));
});
router.post("/", (req, res) => {
    // TODO: Add more authentication logics here
    const { username } = req.body;
    if (username === "username") { // Testing phase: reject the credential if username is "username"
        console.log(`Received invalid credentials: ${username}`);
        return res.status(400).json({ error: "Invalid credentials" });
    }
    console.log(`Received credentials: ${username}`);
    return res.json({ username });
});

export default router;