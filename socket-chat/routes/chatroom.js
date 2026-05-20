// chatroom.js

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = express.Router();

// Get the correct path to a directory (root dir in this case) inside server repository
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

// Get the path to the "views" directory
const pathToViewsDir = path.resolve(__dirname, "../views");

// Chatroom page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "chatroom.html"));
});

export default router;