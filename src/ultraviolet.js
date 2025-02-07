const { affixSlash, timedError, timedLog, certOptions  } = require('./shared');

const path = require("path");
const express = require("express");
const https = require("https");

const ultravioletPath = path.join(__dirname, "../ultraviolet-app", "src", "index.js");
const { createProxyMiddleware } = require("http-proxy-middleware");
const childProcess = require("child_process");
const TARGET_PORT = 8080;
const PORT = 7765;

function init() {
    const app = express();
    function startUltraviolet() {
        const now = new Date();
        timedLog(`${now.toISOString()}: Spawn UV: ${ultravioletPath}.`);
    
        const ultravioletProcess = childProcess.spawn("node", [ultravioletPath], {
            stdio: ["inherit", "pipe", "pipe"],
        });
    
        ultravioletProcess.stdout.on("data", (data) => {
            const now = new Date();
            timedLog(`${now.toISOString()}: UV: ${data.toString()}`.trim());
        });
    
        ultravioletProcess.stderr.on("data", (data) => {
            const now = new Date();
            console.error(`${now.toISOString()}: UV: ${data.toString()}`.trim());
        });
    
        ultravioletProcess.on("error", (err) => {
            console.error(`Failed to start app: ${err.message}`);
        });
    
        process.on("SIGINT", () => {
            timedLog("\nSIGINT received. Shutting down...");
            ultravioletProcess.kill("SIGINT");
            process.exit(0);
        });
    
        process.on("SIGTERM", () => {
            timedLog("\nSIGTERM received. Shutting down...");
            ultravioletProcess.kill("SIGTERM");
            process.exit(0);
        });
    }
    
    app.use("/", createProxyMiddleware({
        target: `http://localhost:${TARGET_PORT}`,
        // changeOrigin: true,
        ws: true,
    }));

    const server = https.createServer(certOptions, app);

    server.listen(PORT, () => {
        startUltraviolet();
        timedLog(`HTTPS Reverse proxy on UV: running on https://localhost:${PORT}, forwarding to ${TARGET_PORT}`);
    });
}

module.exports = {
    init: init
}