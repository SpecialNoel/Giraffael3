// dashboard-routes.js

import express from "express";

import { sendHTMLFile } from "../route-helper.js";
import { authenticateHTTP } from "../../middleware/authenticate-http.js";

const router = express.Router();

// Dashboard page
router.get("/", authenticateHTTP, (req, res) => {
    sendHTMLFile(res, "dashboard.html");
});

export { router };