// import express from "express";
// import { createServer } from "node:https";
// import { join } from "node:path";
// import { hostname } from "node:os";
// import { readFileSync } from "fs";
// import { publicPath } from "../Ultraviolet-Static-main/lib/index.js";
// import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
// import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
// import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
// import wisp from "wisp-server-node";

// const app = express();

// // HTTPS options
// const httpsOptions = {
//     key: readFileSync("/etc/letsencrypt/live/www.project-sentinel.xyz/privkey.pem"),
//     cert: readFileSync("/etc/letsencrypt/live/www.project-sentinel.xyz/fullchain.pem"),
// };

// // Create HTTPS server
// const server = createServer(httpsOptions, app);

// // Middleware to set security headers
// app.use((req, res, next) => {
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//     res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//     next();
// });

// // Serve static files
// app.use(express.static(publicPath));
// app.use("/uv/", express.static(uvPath));
// app.use("/epoxy/", express.static(epoxyPath));
// app.use("/baremux/", express.static(baremuxPath));

// // Handle /uv/uv.config.js explicitly
// app.get("/uv/uv.config.js", (req, res) => {
//     res.sendFile("uv/uv.config.js", { root: publicPath });
// });

// // Handle WebSocket upgrades for Wisp
// server.on("upgrade", (req, socket, head) => {
//     if (req.url.endsWith("/wisp/")) {
//         wisp.routeRequest(req, socket, head);
//     } else {
//         socket.end();
//     }
// });

// // Port configuration
// let port = parseInt(process.env.PORT || "7765");

// server.listen(port, "0.0.0.0", () => {
//     console.log("Listening on:");
//     console.log(`\thttps://localhost:${port}`);
//     console.log(`\thttps://${hostname()}:${port}`);
// });

// // Graceful shutdown
// process.on("SIGINT", shutdown);
// process.on("SIGTERM", shutdown);

// function shutdown() {
//     console.log("SIGTERM signal received: closing HTTP server");
//     server.close(() => {
//         console.log("Server shut down successfully.");
//         process.exit(0);
//     });
// }

// import { createServer } from "node:http";
// import { join } from "node:path";
// import { hostname } from "node:os";
// import wisp from "wisp-server-node";
// import Fastify from "fastify";
// import fastifyStatic from "@fastify/static";

// // static paths
// import { publicPath } from "ultraviolet-static";
// import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
// import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
// import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

// const fastify = Fastify({
// 	serverFactory: (handler) => {
// 		return createServer()
// 			.on("request", (req, res) => {
// 				res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
// 				res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
// 				handler(req, res);
// 			})
// 			.on("upgrade", (req, socket, head) => {
// 				if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
// 				else socket.end();
// 			});
// 	},
// });

// fastify.register(fastifyStatic, {
// 	root: publicPath,
// 	decorateReply: true,
// });

// fastify.get("/uv/uv.config.js", (req, res) => {
// 	return res.sendFile("uv/uv.config.js", publicPath);
// });

// fastify.register(fastifyStatic, {
// 	root: uvPath,
// 	prefix: "/uv/",
// 	decorateReply: false,
// });

// fastify.register(fastifyStatic, {
// 	root: epoxyPath,
// 	prefix: "/epoxy/",
// 	decorateReply: false,
// });

// fastify.register(fastifyStatic, {
// 	root: baremuxPath,
// 	prefix: "/baremux/",
// 	decorateReply: false,
// });

// fastify.server.on("listening", () => {
// 	const address = fastify.server.address();

// 	// by default we are listening on 0.0.0.0 (every interface)
// 	// we just need to list a few
// 	console.log("Listening on:");
// 	console.log(`\thttp://localhost:${address.port}`);
// 	console.log(`\thttp://${hostname()}:${address.port}`);
// 	console.log(
// 		`\thttp://${
// 			address.family === "IPv6" ? `[${address.address}]` : address.address
// 		}:${address.port}`
// 	);
// });

// process.on("SIGINT", shutdown);
// process.on("SIGTERM", shutdown);

// function shutdown() {
// 	console.log("SIGTERM signal received: closing HTTP server");
// 	fastify.close();
// 	process.exit(0);
// }

// let port = parseInt(process.env.PORT || "");

// if (isNaN(port)) port = 8080;

// fastify.listen({
// 	port: port,
// 	host: "0.0.0.0",
// });

import { createServer } from "node:https";
import { hostname } from "node:os";
import { readFileSync } from "fs";
import wisp from "wisp-server-node";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

// Static paths
import { publicPath } from "ultraviolet-static";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

// HTTPS options
const httpsOptions = {
	key: readFileSync("/etc/letsencrypt/live/www.project-sentinel.xyz/privkey.pem"),
	cert: readFileSync("/etc/letsencrypt/live/www.project-sentinel.xyz/fullchain.pem"),
};

// Create Fastify instance
const fastify = Fastify({
	serverFactory: (handler) => {
		return createServer(httpsOptions)
			.on("request", (req, res) => {
				// Set security headers
				res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
				res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
				handler(req, res);
			})
			.on("upgrade", (req, socket, head) => {
				// Handle WebSocket upgrades for Wisp
				if (req.url.endsWith("/wisp/")) {
					wisp.routeRequest(req, socket, head);
				} else {
					socket.end();
				}
			});
	},
});

// Register static file serving
fastify.register(fastifyStatic, {
	root: publicPath,
	decorateReply: true,
});

fastify.get("/uv/uv.config.js", (req, res) => {
	return res.sendFile("uv/uv.config.js", publicPath);
});

fastify.register(fastifyStatic, {
	root: uvPath,
	prefix: "/uv/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: epoxyPath,
	prefix: "/epoxy/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: baremuxPath,
	prefix: "/baremux/",
	decorateReply: false,
});

// Port configuration
let port = parseInt(process.env.PORT || "7765");
if (isNaN(port)) port = 8080;

// Start server
fastify.listen({
	port: port,
	host: "0.0.0.0",
}).then(() => {
	const address = fastify.server.address();

	console.log(`publicPath, ${publicPath.toString()}`);
	console.log(`uvPath, ${uvPath.toString()}`);
	console.log(`epoxyPath, ${epoxyPath.toString()}`);
	console.log(`baremuxPath, ${baremuxPath.toString()}`);

	console.log("Listening on:");
	console.log(`\thttps://localhost:${address.port}`);
	console.log(`\thttps://${hostname()}:${address.port}`);
	console.log(
		`\thttps://${address.family === "IPv6" ? `[${address.address}]` : address.address
		}:${address.port}`
	);
});

// Graceful shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
	console.log("SIGTERM signal received: closing HTTP server");
	fastify.close(() => {
		console.log("Server shut down successfully.");
		process.exit(0);
	});
}