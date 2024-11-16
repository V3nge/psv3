const express = require("express");
const path = require('path');
const fs = require('node:fs');
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

app.ws('/live-chat-ws', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
    console.log('socket', req.testing);
});

app.use(express.static("public"));

app.listen(port);