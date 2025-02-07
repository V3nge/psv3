const { affixSlash, timedError, timedLog, certoptions } = require('./shared');
const expressRateLimit = require("express-rate-limit");
const expressSlowDown = require("express-slow-down");
const childProcess = require("child_process");
const ultraviolet = require('./ultraviolet.js');
const compression = require("compression");
const bodyParser = require('body-parser');
const isElevated = require('is-elevated');
const httpProxy = require('http-proxy');
// const helmet = require('helmet');
const nocache = require("nocache");
var express = require('express');
const https = require('https');
const http = require('http');
const path = require("path");

async function init(DEBUG) {
    var elevated = await isElevated.default();

    if (!elevated) {
        timedLog("This server does not have elevated permissions, which means\n\t" +
            "- The server can only use ports greater than 1024.\n\t" +
            "- The server will automatically redirect any OTHER_PORTS to above 1024 by adding 1024 to it.");
    }

    // Yay, now if they ever find out a way to block any port, we're good!
    // Have not tested, so I don't have any idea of if this works with wss.
    const PORTS = [666, 7764, DEBUG ? 80 : 443];

    // const httpProxy = require('http-proxy');
    // const http = require('http');

    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json()); 
    
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
        } catch (e) {
            console.log(e);
            timedLog("SSH client couldn't load.");
        }
        listenCallback = function () {
            PORTS.forEach(PORT => {
                server.listen(PORT, () => {
                    timedLog(`HTTPS Server running on port ${PORT}`);
                });
            })
        }
        //app.listen(PORT);
    } else {
        listenCallback = function () {
            PORTS.forEach(PORT => {
                timedLog(`HTTP Server running on port ${PORT}`);
                try {
                    app.listen(PORT, '0.0.0.0');
                } catch (e) {
                    // just in case
                    app.listen(PORT)
                }
            });
        }
    }

    if (server == null) {
        timedLog("No server passed into express-ws init.");
        require("express-ws")(app);
    } else {
        timedLog("Express-ws with server init.");
        require("express-ws")(app, server);
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
        startUltraviolet: ultraviolet.init
    };
}

module.exports = {
    init: init
}
