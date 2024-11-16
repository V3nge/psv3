const nocache = require('nocache');
const express = require("express");
const path = require('path');
const fs = require('node:fs');
const app = express();
var expressWs = require('express-ws')(app);

app.use(nocache());

const hostname = "127.0.0.1";
const port = 8000;

var report = fs.readFileSync(path.join(__dirname, `private/report.js`));

var constructedGamesListJSON = null;

function constructGamesListJSON() {
    report = fs.readFileSync(path.join(__dirname, `private/report.js`));
    const directoryPath = path.join(__dirname, 'Public/games');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } else {
            constructedGamesListJSON = files;
        }
    });
}
constructGamesListJSON();

app.get('/games/', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(constructedGamesListJSON));
});

// Instead of adding stuff for EVERY index html,
// just add it from the server side...
app.get(/^\/games\/[^\/]+\/?$/, (req, res) => {
    res.setHeader('content-type', 'text/html');
    try {
        const data = fs.readFileSync(path.join(__dirname, `Public${req.originalUrl.replaceAll(".", "_").replaceAll("index.html", "")}/index.html`), 'utf8');
        res.send(`${data}<script>${report}</script>`);
    } catch (err) {
        if(err.code == "ENOENT") {
            res.sendStatus(404);
        } else {
            console.error(err);
            res.sendStatus(500);
        }
    }
});

const pathStats = {};

function updateCount(path, key) {
    if (!pathStats[path]) {
        pathStats[path] = { starts: 0, recurring: 0 };
    }
    pathStats[path][key]++;
}

app.post("/s", (req, res) => {
    const path = req.query.u;
    if (!path) {
        return res.status(400).send({ error: "Path is required" });
    }
    updateCount(path, "starts");
    res.send();
});

app.post("/r", (req, res) => {
    const path = req.query.u;
    if (!path) {
        return res.status(400).send({ error: "Path is required" });
    }
    updateCount(path, "recurring");
    res.send();
});

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));            
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

var accs = [];
var websockets = [];

app.ws('/live-chat-ws', function(ws, req) {
    ws.on('message', async function(msg) {
        var message = JSON.parse(msg);
        switch(message.type) {
            case "tempacc":
                ws.send(JSON.stringify({"type":"ok_tempacc"}));
                accs.push(message.name);
                websockets.push(ws);
            break;
            case "tempacc_gsend":
                if(accs.includes(message.sender)) {
                    ws.send(JSON.stringify({"type":"ok"}));
                    var senderHash = await sha256(message.sender);
                    websockets.forEach(cws => {
                        cws.send(JSON.stringify({"type":"gsend_r","msg":message.msg,"sender":senderHash}));
                    });
                } else {
                    ws.send(JSON.stringify({"type":"nuh uh"}));
                }
            break;
            default:
                ws.send(JSON.stringify({"type":"unknowntype","value":message.type}))
            break;
        }
    });
    console.log('socket', req.testing);
});

app.use(express.static("public"));

app.listen(port);