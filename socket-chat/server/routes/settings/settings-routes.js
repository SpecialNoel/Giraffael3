// settings-routes.js

import express from "express";
import path from "node:path";

import { sendHTMLFile } from "../route-helper.js";

const router = express.Router();

// Settings page
router.get("/", (req, res) => {
    sendHTMLFile(res, "settings.html");
});

export { router };