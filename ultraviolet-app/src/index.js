import express from "express";
import { createServer } from "node:https";
import { join } from "node:path";
import { hostname } from "node:os";
import { readFileSync } from "fs";
import { publicPath } from "../Ultraviolet-Static-main/lib/index.js";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import wisp from "wisp-server-node";

const app = express();

// HTTPS options
const httpsOptions = {
    key: readFileSync("/etc/letsencrypt/live/www.project-sentinel.xyz/privkey.pem"),
    cert: readFileSync("/etc/letsencrypt/live/www.project-sentinel.xyz/fullchain.pem"),
};

// Create HTTPS server
const server = createServer(httpsOptions, app);

// Middleware to set security headers
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

// Serve static files
app.use(express.static(publicPath));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

// Handle /uv/uv.config.js explicitly
app.get("/uv/uv.config.js", (req, res) => {
    res.sendFile("uv/uv.config.js", { root: publicPath });
});

// Handle WebSocket upgrades for Wisp
server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
    } else {
        socket.end();
    }
});

// Port configuration
let port = parseInt(process.env.PORT || "7765");

server.listen(port, "0.0.0.0", () => {
    console.log("Listening on:");
    console.log(`\thttps://localhost:${port}`);
    console.log(`\thttps://${hostname()}:${port}`);
});

// Graceful shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        console.log("Server shut down successfully.");
        process.exit(0);
    });
}
