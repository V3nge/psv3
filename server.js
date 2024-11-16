const express = require("express");
const path = require('path');
const fs = require('node:fs');
const app = express();

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

setInterval(() => constructGamesListJSON, 100000);

app.get('/games/', (req, res) => {
    if(constructedGamesListJSON != null) {
        res.send(JSON.stringify([]));
    } else {
        res.send(JSON.stringify(constructedGamesListJSON));
    }
});

app.use(express.static("public"));

app.listen(port);