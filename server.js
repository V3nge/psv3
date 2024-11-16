const express = require("express");
const path = require('path');
const fs = require('node:fs');
const { json } = require("body-parser");
const app = express();
var expressWs = require('express-ws')(app);

const hostname = "127.0.0.1";
const port = 8000;

var constructedGamesListJSON = null;

function constructGamesListJSON() {
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