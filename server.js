const DEBUG = true;
const crypto = require("crypto");
const nocache = require('nocache');
const express = require("express");
const path = require('path');
const fs = require('fs');
const expressRateLimit = require('express-rate-limit');
const expressSlowDown = require("express-slow-down");
const Fuse = require('fuse.js');
const app = express();
var expressWs = require('express-ws')(app);

if(!DEBUG) {
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
}

app.use(nocache());

const hostname = "127.0.0.1";
const port = 8000;

var report = fs.readFileSync(path.join(__dirname, `private/report.html`));

var constructedGamesListJSON = null;

function getCurrentTime() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return ` (${hours}:${formattedMinutes} ${ampm})`;
}

var constructedGamesListJSONTimestamp;
function constructGamesListJSON() {
    const jsonData = fs.readFileSync(path.join(__dirname, './private/all.json'), 'utf-8');
    constructedGamesListJSON = JSON.parse(jsonData);
    constructedGamesListJSONTimestamp = +Date.now();
}

constructGamesListJSON();

app.get('/games/', (req, res) => {
    // Updates the games list every 30 minutes (in ms)
    if((Date.now() - constructedGamesListJSONTimestamp) > 1800000) {
        constructGamesListJSON();
    }

    res.setHeader('content-type', 'application/json');
    res.send(constructedGamesListJSON);
});

// Instead of adding stuff for EVERY index html,
// just add it from the server side...
app.get(/^\/games\/[^\/]+\/?$/, (req, res) => {
    res.setHeader('content-type', 'text/html');
    try {
        const data = fs.readFileSync(path.join(__dirname, `Public${req.originalUrl.replaceAll(".", "_").replaceAll("index.html", "")}/index.html`), 'utf8');
        res.send(`${data}${report}`);
    } catch (err) {
        if (err.code == "ENOENT") {
            res.sendStatus(404);
        } else {
            console.error(err);
            res.sendStatus(500);
        }
    }
});

const adjectives = [
    "Sticky", "Bouncy", "Slimy", "Fizzy", "Fluffy", "Wobbly", "Puffy", "Zesty",
    "Oozy", "Frothy", "Spiky", "Greasy", "Chewy", "Shiny", "Lumpy", "Mushy",
    "Gritty", "Fuzzy", "Rusty", "Quirky", "Tacky", "Drippy", "Frosty", "Slick",
    "Grimy", "Blobby", "Waxy", "Slippery", "Musty", "Swirly", "Wonky", "Frizzy",
    "Chunky", "Cute", "Hungry", "Wet", "Tiny", "Big", "Bright", "Soft", "Smooth",
    "Warm", "Cool", "Colorful", "Light", "Heavy", "Gentle", "Happy", "Quick", "Quiet"
];

const nouns = [
    "Tissue", "Toaster", "Banana", "Shoe", "Cactus", "Biscuit", "Penguin", "Balloon",
    "Pillow", "Toothbrush", "Sock", "Lamp", "Pencil", "Towel", "Chair", "Bottle",
    "Cupcake", "Turtle", "Sandwich", "Lollipop", "Potato", "Slipper", "Hat", "Book",
    "Teapot", "Key", "Umbrella", "Soap", "Butterfly", "Pumpkin", "Donut", "Crayon",
    "Clock", "Cloud", "Dragon", "Shovel", "Robot", "Bubble", "Spider", "Taco",
    "Fish", "Pizza", "Bag", "Panda", "Cushion", "Cat", "Carrot", "Owl", "Rock",
    "Flower", "Tree", "Bird", "House", "Garden", "Star", "River", "Mountain", "Boat",
    "Dog", "Beach", "Shell", "Fruit", "Leaf", "Window", "Bridge", "Train", "Snowman"
];


// Function to generate a random combination
function getRandomCombination() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return randomAdjective + randomNoun;
}

const pathStats = {};

function updateCount(path, key) {
    if (!pathStats[path]) {
        pathStats[path] = { starts: 0, recurring: 0 };
    }
    pathStats[path][key]++;
}

app.get("/stats", (req, res) => {
    res.send(pathStats);
})

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
var accs_vanities = [];
var websockets = [];
var rooms = [];

function createPrivateRoom(name) {
    rooms.push(name);
    return `${encodeURIComponent(name)}`;
}

app.get('/check_room', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.send(rooms.includes(req.query.id));
});

app.get('/search', (req, res) => {
    res.setHeader('content-type', 'application/json');

    const searchQuery = req.query.search?.toLowerCase() || '';
    if (!searchQuery) {
        res.send(JSON.stringify([]));
        return;
    }

    const options = {
        keys: ['name', 'thumbnail', 'slug'],
        threshold: 0.3,               
        includeScore: true
    };

    const fuse = new Fuse(constructedGamesListJSON, options);
    const results = fuse.search(searchQuery);

    const filtered = results.map(result => result.item);

    res.send(JSON.stringify(filtered));
});


app.use('/images', express.static("public/images/games/"));
app.use('/game', express.static("public/games/game/"));

app.ws('/live-chat-ws', function (ws, req) {
    ws.on('message', async function (msg) {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "tempacc":
                ws.send(JSON.stringify({ "type": "ok_tempacc" }));
                accs.push(message.name);
                console.log(message);
                console.log(message.vanity);
                if (message.vanity == null || message.vanity.trim() == "" || message.vanity.trim().length > 30) {
                    var randomCombinationThing = getRandomCombination();
                    console.log(randomCombinationThing);
                    message.vanity = randomCombinationThing;
                }
                accs_vanities.push(message.vanity.trim());
                websockets.push({socket: ws, channel: message.channel});
                break;
            case "tempacc_gsend":
                if (accs.includes(message.sender)) {
                    var decodedMessage = decodeURIComponent(message.msg);
                    if (decodedMessage.trim() == "" || decodedMessage.trim().length > 2001) {
                        ws.send(JSON.stringify({ "type": "nuh uh" }));
                        break;
                    }
                    ws.send(JSON.stringify({ "type": "ok" }));
                    const senderHash = await sha256(message.sender);
                    websockets.forEach(person => {
                        if (person.channel == message.channel) {
                            console.log(accs_vanities)
                            console.log(accs_vanities[accs.indexOf(message.sender)]);
                            person.socket.send(JSON.stringify({
                                "type": "gsend_r",
                                "msg": encodeURIComponent(decodedMessage.trim() + getCurrentTime()),
                                "sender": senderHash,
                                "vanity": accs_vanities[accs.indexOf(message.sender)]
                            }));
                        }
                    });
                } else {
                    ws.send(JSON.stringify({ "type": "nuh uh" }));
                }
                break;
            case "newpri":
                const senderHash = await sha256(message.sender);
                ws.send(JSON.stringify({ "type": "pri", "msg": createPrivateRoom(message.code), "sender": senderHash }));
                break;
            default:
                ws.send(JSON.stringify({ "type": "unknowntype", "value": message.type }));
        }
    });
});

app.use(express.static("public"));

app.listen(port);