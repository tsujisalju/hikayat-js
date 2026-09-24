// old static server, now using Express server on root directory

import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "public");

//mime type lookup via file extension, express.static handles this for you.
const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
};

const PORT = 3001;

const server = http.createServer(async (req, res) => {
    let requestedPath = req.url === "/" ? "/index.html" : req.url;

    const filePath = path.join(PUBLIC_DIR, requestedPath)

    // Security check: make sure the requested path is within the public directory
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
    }

    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";

    try {
        const data = await readFile(filePath);
        res.statusCode = 200;
        res.setHeader("Content-Type", mimeType);
        res.end(data);
    } catch (err) {
        if (err.code === "ENOENT") {
            res.statusCode = 404;
            res.end("Not Found");
        } else {
            res.statusCode = 500;
            res.end("Internal Server Error");
        }
    }
})

server.listen(PORT, () => {
    console.log(`Static server is running on http://localhost:${PORT}`);
});
