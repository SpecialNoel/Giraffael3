// dashboard-routes.js

import express from "express";
import path from "node:path";

import { sendHTMLFile } from "../route-helper.js";

const router = express.Router();

// Dashboard page
router.get("/", (req, res) => {
    sendHTMLFile(res, "dashboard.html");
});

export { router };