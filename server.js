const DEBUG = true;
const crypto = require("crypto");
const nocache = require("nocache");
const express = require("express");
const path = require("path");
const fs = require("fs");
const expressRateLimit = require("express-rate-limit");
const expressSlowDown = require("express-slow-down");
const Fuse = require("fuse.js");
const compression = require("compression");

// should probably use this in the future, but is causing problems now...
// const helmet = require('helmet');
// const morgan = require('morgan');

const app = express();
var expressWs = require("express-ws")(app);

app.use(compression());

// app.use(helmet());
// app.use(morgan('combined'));

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
}

app.use(nocache());

const hostname = "127.0.0.1";
const port = 7764;

var report = fs.readFileSync(path.join(__dirname, `private/report.html`));

var constructedGamesListJSON = null;

function getCurrentTime() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return ` (${hours}:${formattedMinutes} ${ampm})`;
}

var constructedGamesListJSONTimestamp;
function constructGamesListJSON() {
  const jsonData = fs.readFileSync(
    path.join(__dirname, "./private/all.json"),
    "utf-8"
  );
  constructedGamesListJSON = JSON.parse(jsonData);
  constructedGamesListJSONTimestamp = +Date.now();
}

constructGamesListJSON();

app.get("/games/", (req, res) => {
  // Updates the games list every 30 minutes (in ms)
  if (Date.now() - constructedGamesListJSONTimestamp > 1800000) {
    constructGamesListJSON();
  }

  res.setHeader("content-type", "application/json");
  res.send(constructedGamesListJSON);
});

// // Instead of adding stuff for EVERY index html,
// // just add it from the server side...
app.get(/^\/games\/[^\/]+\/?$/, (req, res) => {
  res.setHeader('Content-Type', 'text/html');

  const safeUrl = path.normalize(req.originalUrl);
  const filePath = path.join(__dirname, 'public', safeUrl, 'index.html');
  const ipAddress = req.ip;
  const now = new Date();

  console.log(now.toISOString() + ":" + ipAddress + ": Serving file: " + filePath);

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          if (err.code === 'ENOENT') {
              console.log(now.toISOString() + ":" + ipAddress + ": Error file not found: " + filePath);
              res.sendStatus(404);
          } else {
              console.log(now.toISOString() + ":" + ipAddress + ": Error reading file: " + err);
              res.sendStatus(500);
          }
          return;
      }

      res.send(`${data}${report}`);
  });
});

const adjectives = [
  "Sticky",
  "Bouncy",
  "Slimy",
  "Fizzy",
  "Fluffy",
  "Wobbly",
  "Puffy",
  "Zesty",
  "Oozy",
  "Frothy",
  "Spiky",
  "Greasy",
  "Chewy",
  "Shiny",
  "Lumpy",
  "Mushy",
  "Gritty",
  "Fuzzy",
  "Rusty",
  "Quirky",
  "Tacky",
  "Drippy",
  "Frosty",
  "Slick",
  "Grimy",
  "Blobby",
  "Waxy",
  "Slippery",
  "Musty",
  "Swirly",
  "Wonky",
  "Frizzy",
  "Chunky",
  "Cute",
  "Hungry",
  "Wet",
  "Tiny",
  "Big",
  "Bright",
  "Soft",
  "Smooth",
  "Warm",
  "Cool",
  "Colorful",
  "Light",
  "Heavy",
  "Gentle",
  "Happy",
  "Quick",
  "Quiet",
];

const nouns = [
  "Tissue",
  "Toaster",
  "Banana",
  "Shoe",
  "Cactus",
  "Biscuit",
  "Penguin",
  "Balloon",
  "Pillow",
  "Toothbrush",
  "Sock",
  "Lamp",
  "Pencil",
  "Towel",
  "Chair",
  "Bottle",
  "Cupcake",
  "Turtle",
  "Sandwich",
  "Lollipop",
  "Potato",
  "Slipper",
  "Hat",
  "Book",
  "Teapot",
  "Key",
  "Umbrella",
  "Soap",
  "Butterfly",
  "Pumpkin",
  "Donut",
  "Crayon",
  "Clock",
  "Cloud",
  "Dragon",
  "Shovel",
  "Robot",
  "Bubble",
  "Spider",
  "Taco",
  "Fish",
  "Pizza",
  "Bag",
  "Panda",
  "Cushion",
  "Cat",
  "Carrot",
  "Owl",
  "Rock",
  "Flower",
  "Tree",
  "Bird",
  "House",
  "Garden",
  "Star",
  "River",
  "Mountain",
  "Boat",
  "Dog",
  "Beach",
  "Shell",
  "Fruit",
  "Leaf",
  "Window",
  "Bridge",
  "Train",
  "Snowman",
];

// Function to generate a random combination
function getRandomCombination() {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
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
});

function affixSlash(path) {
  path = path.trim();
  if(path.endsWith("/")) { return path; }
  return `${path}/`;
}

app.post("/s", (req, res) => {
  const path = affixSlash(req.query.u);
  if (!path) {
    return res.status(400).send({ error: "Path is required" });
  }
  updateCount(path, "starts");
  res.send();
});

app.post("/r", (req, res) => {
  const path = affixSlash(req.query.u);
  if (!path) {
    return res.status(400).send({ error: "Path is required" });
  }
  updateCount(path, "recurring");
  res.send();
});

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

app.get("/check_room", (req, res) => {
  res.setHeader("content-type", "application/json");
  res.send(rooms.includes(req.query.id));
});

app.get("/search", (req, res) => {
  res.setHeader("content-type", "application/json");

  const searchQuery = req.query.search.toLowerCase() || "";
  if (!searchQuery) {
    res.send(JSON.stringify([]));
    return;
  }

  const options = {
    keys: ["name", "thumbnail", "slug"],
    threshold: 0.3,
    includeScore: true,
  };

  const fuse = new Fuse(constructedGamesListJSON, options);
  const results = fuse.search(searchQuery);

  const filtered = results.map((result) => result.item);

  res.send(JSON.stringify(filtered));
});

app.use("/images", express.static("public/images/games/"));
app.use("/game", express.static("public/games/game/"));

var activeUsers = 0;

app.get("/chat-names", (req, res) => {
  res.setHeader("content-type", "application/json");
  res.send(accs_vanities);
});

app.ws("/live-chat-ws", function (ws, req) {
  let thisUser = {};
  activeUsers++;

  const removeUser = (user) => {
    const index = accs.indexOf(user.name);
    if (index !== -1) {
      accs.splice(index, 1);
      accs_vanities.splice(index, 1);
      websockets.splice(index, 1);
      console.log(`User removed: ${user.name}`);
      var message = {
        "decodedMessage" : `${user.vanity} has left the chat!`
      };
      sendToChannel(user.channel, message, null);
    } else {
      console.log("User not found in users list!");
    }
  };

  const sendToChannel = (channel, message, senderHash) => {
    websockets.forEach((person) => {
      if (person.channel === channel) {
        person.socket.send(
          JSON.stringify({
            type: "gsend_r",
            msg: encodeURIComponent(message.decodedMessage + getCurrentTime()),
            sender: senderHash,
            vanity: accs_vanities[accs.indexOf(message.sender)],
          })
        );
      }
    });
  };

  ws.on("close", async function (err) {
    activeUsers--;
    removeUser(thisUser);
  });

  ws.on("message", async function (msg) {
    const message = JSON.parse(msg);
    const ipAddress = req.ip;
    const now = new Date();

    switch (message.type) {
      case "names":
        ws.send(JSON.stringify({ type: "nameslist", value: JSON.stringify(accs_vanities) }));
        break;

      case "tempacc":
        thisUser = message;
        ws.send(JSON.stringify({ type: "ok_tempacc" }));

        accs.push(message.name);
        console.log(message);
        console.log(message.vanity);
        if (
          message.vanity == null ||
          message.vanity.trim() == "" ||
          message.vanity.trim().length > 30
        ) {
          var randomCombinationThing = getRandomCombination();
          console.log(randomCombinationThing);
          message.vanity = randomCombinationThing;
        }
        accs_vanities.push(message.vanity.trim());

        websockets.push({ socket: ws, channel: message.channel });
        thisUser.websocket = { socket: ws, channel: message.channel };
        break;

      case "tempacc_gsend":
        if (accs.includes(message.sender)) {
          const decodedMessage = decodeURIComponent(message.msg);
          if (decodedMessage.trim() === "" || decodedMessage.trim().length > 2001) {
            ws.send(JSON.stringify({ type: "nuh uh" }));
            break;
          }
          ws.send(JSON.stringify({ type: "ok" }));

          message.decodedMessage = decodedMessage;

          const senderHash = await sha256(message.sender);

          console.log(message);
          console.log(decodedMessage);

          sendToChannel(message.channel, message, senderHash);
        } else {
          ws.send(JSON.stringify({ type: "nuh uh" }));
        }
        break;

      case "newpri":
        const senderHash = await sha256(message.sender);
        ws.send(
          JSON.stringify({
            type: "pri",
            msg: createPrivateRoom(message.code),
            sender: senderHash,
          })
        );
        break;

      default:
        ws.send(JSON.stringify({ type: "unknowntype", value: message.type }));
    }
  });
});

app.use(express.static("public"));

app.listen(port);
