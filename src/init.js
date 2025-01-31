const { affixSlash, timedError, timedLog } = require('./shared');
const expressRateLimit = require("express-rate-limit");
const expressSlowDown = require("express-slow-down");
const childProcess = require("child_process");
const { certoptions } = require("./shared");
const compression = require("compression");
const bodyParser = require('body-parser');
const isElevated = require('is-elevated');
// const helmet = require('helmet');
const nocache = require("nocache");
var express = require('express');
const https = require('https');
const http = require('http');
const path = require("path");

async function init(DEBUG) {
    var elevated = await isElevated.default();

    if(!elevated) {
        timedLog("This server does not have elevated permissions, which means\n\t" + 
            "- The server can only use ports greater than 1024.\n\t" +
            "- The server will automatically redirect any OTHER_PORTS to above 1024 by adding 1024 to it.");
    }

    // Yay, now if they ever find out a way to block any port, we're good!
    // Have not tested, so I don't have any idea of if this works with wss.
    const OTHER_PORTS = [
        666
    ];

    const PORT = 7764;

    OTHER_PORTS.forEach((port) => {
        try {
            if (port == 8080) {
                timedLog("8080 is for UV and cannot be an OTHER_PORTS element.");
                return;
            }

            if (port < 1024 && !elevated) {
                timedLog(`Port ${port} is privileged and usually requires elevated permissions: switching to ${port + 1024}.`);
                port += 1024;
            }

            var httpsOrHttps = DEBUG ? http : https;

            httpsOrHttps
                .createServer(
                    certoptions,
                    (req, res) => {
                        const options = {
                            hostname: "localhost",
                            port: PORT,
                            path: req.url,
                            method: req.method,
                            headers: req.headers,
                        };

                        const proxy = http.request(options, (proxyRes) => {
                            res.writeHead(proxyRes.statusCode, proxyRes.headers);
                            proxyRes.pipe(res, { end: true });
                        });

                        proxy.on("error", (err) => {
                            console.error(`Error forwarding request on port ${port}:`, err);
                            res.writeHead(500);
                            res.end("Internal Server Error");
                        });

                        req.pipe(proxy, { end: true });
                    })
                .listen(port, () => {
                    timedLog(`Redirecting traffic from port ${port} to port ${PORT}`);
                });
        } catch (e) {
            timedLog(`Cannot map port: ${port}`);
        }
    });

    // const httpProxy = require('http-proxy');
    // const http = require('http');

    const app = express();

    if (!DEBUG) {
        const limiter = expressRateLimit({
            windowMs: 60 * 1000,
            max: 500,
        });

        const speedLimiter = expressSlowDown({
            windowMs: 15 * 1000,
            delayAfter: 125,
            delayMs: () => 1500,
        });

        app.use(speedLimiter);
        app.use(limiter);
    } else {
        app.use(nocache());
    }

    var server = null;
    var listenCallback = null;

    if (!DEBUG) {
        server = https.createServer(certoptions, app);
        try {
            require("./ssh").init(app, server);
        } catch(e) {
            console.log(e);
            timedLog("SSH client couldn't load.");
        }
        listenCallback = function () {
            server.listen(PORT, () => {
                timedLog(`HTTPS Server running on port ${PORT}`);
            });
        }
        //app.listen(PORT);
    } else {
        listenCallback = function () {
            timedLog(`HTTP Server running on port ${PORT}`);
            try {
                app.listen(PORT, '0.0.0.0');
            } catch (e) {
                // just in case
                app.listen(PORT)
            }
        }
    }

    if (server == null) {
        timedLog("No server passed into express-ws init.");
        require("express-ws")(app);
    } else {
        timedLog("Express-ws with server init.");
        require("express-ws")(app, server);
    }

    const ultravioletPath = path.join(__dirname, "../ultraviolet-app", "src", "index.js");

    function startUltraviolet() {
        const now = new Date();
        timedLog(`${now.toISOString()}: Spawn UV: ${ultravioletPath}.`);

        const ultravioletProcess = childProcess.spawn("node", [ultravioletPath], {
            stdio: ['inherit', 'pipe', 'pipe'],
        });

        ultravioletProcess.stdout.on('data', (data) => {
            const now = new Date();
            timedLog(`${now.toISOString()}: UV: ${data.toString()}`.trim());
        });

        ultravioletProcess.stderr.on('data', (data) => {
            const now = new Date();
            console.error(`${now.toISOString()}: UV: ${data.toString()}`.trim());
        });

        ultravioletProcess.on("error", (err) => {
            console.error(`Failed to start app: ${err.message}`);
        });

        ultravioletProcess.on("SIGINT", () => {
            timedLog("\nSIGINT received. Shutting down...");
            ultravioletProcess.kill("SIGINT");
            process.exit(0);
        });

        ultravioletProcess.on("SIGTERM", () => {
            timedLog("\nSIGTERM received. Shutting down...");
            ultravioletProcess.kill("SIGTERM");
            process.exit(0);
        });
    }

    // // app.use(
    // //   helmet({
    // //     crossOriginEmbedderPolicy: { policy: 'require-corp' }, // Enforce COEP
    // //   })
    // // );

    // // var allowedOrigins = [
    // //   "https://gimkit.com",
    // //   "https://unpkg.com",
    // //   "http://project-sentinel.xyz:7764",
    // //   "https://project-sentinel.xyz:7764",
    // //   "http://project-sentinel.xyz:7765",
    // //   "https://project-sentinel.xyz:7765",
    // //   "http://localhost:7764",
    // //   "https://localhost:7764",
    // //   "http://localhost:7765",
    // //   "https://localhost:7765"
    // // ];

    // // var betterAllowedOrigins = [];

    // // allowedOrigins.forEach(origin => {
    // //   betterAllowedOrigins.push(origin);
    // //   betterAllowedOrigins.push(origin.replace("://", `:\/\/*.`));
    // // });

    // // allowedOrigins = betterAllowedOrigins;

    // // app.all('*', function (req, res, next) {
    // // res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    // // res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    // // res.setHeader('X-Content-Type-Options', 'nosniff');
    // // res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    // // res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=()');
    // // res.setHeader(
    // //   'Content-Security-Policy',
    // //   `default-src 'self' ${allowedOrigins.join(" ")}; frame-ancestors 'self' https://www.project-sentinel.xyz:7765/; script-src 'self'; object-src 'none';`
    // // );
    // // res.setHeader(
    // //   'Content-Security-Policy',
    // //   `default-src 'self'; frame-ancestors 'self' https://www.project-sentinel.xyz:7765/;`
    // // );

    // // next();

    // // const origin = req.headers.origin;

    // // if (allowedOrigins.includes(origin)) {
    // //   res.setHeader('Access-Control-Allow-Origin', origin);
    // // }

    // // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // // res.setHeader('Access-Control-Allow-Credentials', 'true');

    // // if (req.method === 'OPTIONS') {
    // //   res.sendStatus(200);
    // // } else {
    // //   next();
    // // }
    // // });

    // // This allows about:blank to work.
    // // app.all('*', function (req, res, next) {
    // //   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    // //   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    // //   res.setHeader('Access-Control-Allow-Origin', '*');
    // //   res.setHeader('Content-Security-Policy', "default-src *; frame-ancestors *");
    // //   res.setHeader('Referrer-Policy', 'none');
    // //   next();
    // // });

    // app.all('*', function (req, res, next) {
    //     // res.setHeader('Access-Control-Allow-Origin', '*');
    //     // res.setHeader('Access-Control-Allow-Methods', '*');
    //     // res.setHeader('Access-Control-Allow-Headers', '*');
    //     // res.setHeader('Access-Control-Allow-Credentials', 'true');
    //     // res.removeHeader('Cross-Origin-Embedder-Policy');
    //     // res.removeHeader('Cross-Origin-Opener-Policy');
    //     // res.removeHeader('Content-Security-Policy');
    //     // res.removeHeader('Referrer-Policy');


    //     next();
    //   });

    //   // app.use(cors({ origin: ["https://gimkit.com/", "https://sacs.instructure.com/", "https://unpkg.com/"] }));


    app.all('*', function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://www.project-sentinel.xyz:7765");

        res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.project-sentinel.xyz:7765');

        res.removeHeader('Cross-Origin-Embedder-Policy');
        res.removeHeader('Cross-Origin-Opener-Policy');
        res.removeHeader('Referrer-Policy');

        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        next();
    });

    app.use(compression());
    app.use(bodyParser.json());

    return {
        app: app,
        express: express,
        listenCallback: listenCallback,
        startUltraviolet: startUltraviolet
    };
}

module.exports = {
    init: init
}