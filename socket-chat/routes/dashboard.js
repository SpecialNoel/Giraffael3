// dashboard.js

import express from "express";
import path from "node:path";
import pathToViewsDir from "./route-helper.js"

const router = express.Router();

// Dashboard page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "dashboard.html"));
});

export default router;