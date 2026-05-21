// chatroom-router.js

import express from "express";
import path from "node:path";
import pathToViewsDir from "./route-helper.js"

const router = express.Router();

// Chatroom page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "chatroom.html"));
});

export default router;