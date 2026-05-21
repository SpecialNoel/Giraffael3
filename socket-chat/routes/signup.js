// signup.js

import express from "express";
import path from "node:path";
import pathToViewsDir from "./route-helper.js"

const router = express.Router();

// Sign-up page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "signup.html"));
});

export default router;