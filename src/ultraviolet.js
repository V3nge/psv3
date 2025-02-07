const { timedError, timedLog, certoptions } = require("./shared");
const path = require("path");
const express = require("express");
const https = require("https");
const reverseProxy = require('reverse-proxy');
const childProcess = require("child_process");

const ultravioletPath = path.join(__dirname, "../ultraviolet-app", "src", "index.js");
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
    
    // Set up the reverse proxy server
    reverseProxy.createServer({
        port: 8000, // the port to listen for incoming proxy requests
        map: function (config) {
            // Specific path mapping for a request to localhost
            if (config.path === '/kissy/k/1.4.0/seed-min.js') {
                config.path = '/t.js'; // remap the path
                config.host = 'localhost'; // use localhost as the target host
                console.log('Refetch from: ' + config.host + config.path);
            }
            return config; // return the modified config object
        }
    });

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        next();
    });

    const server = https.createServer(certoptions, app);
    
    server.listen(PORT, () => {
        startUltraviolet();
        timedLog(`HTTPS Reverse proxy on UV: running on https://localhost:${PORT}, forwarding to ${TARGET_PORT}`);
    });
}

module.exports = {
    init: init
};
