// route-helper.js

import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the correct path to a directory (root dir in this case) inside server repository
const projectRoot = process.cwd();

// Get the path to the "views" directory
const pathToViewsDir = path.join(projectRoot, "views");

// Send the target html file to client
function sendHTMLFile(res, filename) {
    res.sendFile(path.join(pathToViewsDir, filename));
}

export { sendHTMLFile };