const { affixSlash, timedError, timedLog, certoptions } = require("./shared");
const path = require("path");
const express = require("express");
const https = require("https");
const httpProxy = require("http-proxy");
const childProcess = require("child_process");

const ultravioletPath = path.join(__dirname, "../ultraviolet-app", "src", "index.js");
const TARGET_PORT = 8080;
const PORT = 7765;

function init() {
    const app = express();
    const proxy = httpProxy.createProxyServer({ target: `http://localhost:${TARGET_PORT}`, ws: true });
    
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
    
    app.use((req, res, next) => {
        // Log request headers to verify everything is being sent
        console.log("Incoming Request Headers:", req.headers);
        
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        next();
    });
    
    proxy.on("proxyRes", (proxyRes, req, res) => {
        // Log response headers to verify everything is being forwarded
        console.log("Response Headers from Proxy Target:", proxyRes.headers);
        
        // Pass all the headers to the actual response
        Object.keys(proxyRes.headers).forEach((key) => {
            res.setHeader(key, proxyRes.headers[key]);
        });
    });

    app.use((req, res) => {
        proxy.web(req, res);
    });

    const server = https.createServer(certoptions, app);
    
    server.on("upgrade", (req, socket, head) => {
        // Log the upgrade headers (if any) for WebSocket connections
        console.log("WebSocket Upgrade Headers:", req.headers);
        proxy.ws(req, socket, head);
    });

    server.listen(PORT, () => {
        startUltraviolet();
        timedLog(`HTTPS Reverse proxy on UV: running on https://localhost:${PORT}, forwarding to ${TARGET_PORT}`);
    });
}

module.exports = {
    init: init
};
