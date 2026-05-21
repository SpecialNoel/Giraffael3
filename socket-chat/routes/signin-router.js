// signin-router.js

import express from "express";
import path from "node:path";
import pathToViewsDir from "./route-helper.js"

const router = express.Router();

// Sign-in page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "signin.html"));
});

export default router;