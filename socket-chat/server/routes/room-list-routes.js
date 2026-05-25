// room-list-routes.js

import express from "express";
import path from "node:path";
import pathToViewsDir from "./route-helper.js"

const router = express.Router();

// Room page
router.get("/", (req, res) => {
    res.sendFile(path.join(pathToViewsDir, "room-list.html"));
});

export default router;