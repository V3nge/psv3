const DEBUG = false;
const ADJECTIVES = [
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

const NOUNS = [
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

const PING_TIMEOUT = 10000;
const PORT = 7764;

const crypto = require("crypto");
const nocache = require("nocache");
const express = require("express");
const path = require("path");
const fs = require("fs");
const expressRateLimit = require("express-rate-limit");
const expressSlowDown = require("express-slow-down");
const bodyParser = require('body-parser');
const Fuse = require("fuse.js");
const compression = require("compression");
const axios = require("axios");
// const httpProxy = require('http-proxy');
// const http = require('http');

const app = express();
var expressWs = require("express-ws")(app);
var accs = [];
var accs_vanities = [];
var websockets = [];
var rooms = [];
var lastSavedPathStats = +Date.now();
var lastUpdatedIndex = 0;
var indexHtml = ""
var activeUsers = 0;
var report = fs.readFileSync(path.join(__dirname, `private/report.html`));
var constructedGamesListJSON = null;
var blockedUIDs = [];
var pathStats = {};

// var proxy = httpProxy.createProxyServer({});

// var server = http.createServer(function (req, res) {
//     proxy.web(req, res, { target: 'http://youtube.com/' });
// });

// server.listen(6969);

try {
  const data = fs.readFileSync("path-stats.json");
  pathStats = JSON.parse(data);
  const now = new Date();
  console.log(`${now.toISOString()}: Success: Loaded path-stats.json`);
} catch (err) {
  const now = new Date();
  console.error(`${now.toISOString()}: Error, file not found: path-stats.json`);
}

app.use(compression());
app.use(bodyParser.json());

const logDirectory = path.join(__dirname, 'error-logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

app.post('/error', (req, res) => {
  console.log("no sigma3")
  const { message, source, lineno, colno, stack } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const timestamp = new Date().toISOString();
  const logMessage = `Timestamp: ${timestamp}\nIP Address: ${ipAddress}\nMessage: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nStack: ${stack}\n\n`;

  fs.appendFile(path.join(logDirectory, 'errors.log'), logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });

  res.status(200).send('Error received and logged');
});

// should probably use this in the future, but is causing problems now...
// const helmet = require('helmet');
// const morgan = require('morgan');
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
} else {
  app.use(nocache());
}

var accumulatingMessages = "";
var numberOfAccumulatedMessages = 0;
function sendMessageToWebHook(message) {
  if (!DEBUG) {
    numberOfAccumulatedMessages++;
    accumulatingMessages += `${message}\n`;

    if (numberOfAccumulatedMessages > 10) {
      numberOfAccumulatedMessages = 0;
      const params = {
        // username: "My Webhook Name",
        // avatar_url: "",
        content: accumulatingMessages,
      };

      axios
        .post(
          "https://discord.com/api/webhooks/1312849186206781551/S8GoX1oEc6_Oh2pSIxZlXHTCyyl4tGHVeLsgpztrbqrsgsAp9rII1qS0l3Zi3hycoETV",
          params,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Message sent successfully:", response.status);
        })
        .catch((error) => {
          console.error("Error sending message:", error.message);
        });
      accumulatingMessages = "";
    }
  } else {
    console.log("Not sending to discord webhook because DEBUG is set to true.");
  }
}

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

function loadAllGames(ToSearch = null) {
  try {
    let listing;

    if (ToSearch == null) {
      listing = constructedGamesListJSON;
    } else {
      const searchQuery = ToSearch.toLowerCase() || "";

      const options = {
        keys: ["name", "thumbnail", "slug"],
        threshold: 0.3,
        includeScore: true,
      };

      const fuse = new Fuse(constructedGamesListJSON, options);
      const results = fuse.search(searchQuery);

      const filtered = results.map((result) => result.item);

      listing = filtered;
    }

    const gameStats = pathStats;

    function calculateAndSortScores(gameData) {
      const gameEntries = Object.entries(gameData);
      return gameEntries
        .map(([game, stats]) => {
          const score = (stats.recurring / stats.starts || 0) + (stats.recurring * 2);
          return { game, score, starts: stats.starts, recurring: stats.recurring };
        })
        .sort((a, b) => b.score - a.score);
    }

    const popularGames = calculateAndSortScores(gameStats);

    const buildCarouselHTML = (games) =>
      games
        .map(
          (game) => `
                  <div class="carousel-element centered">
                      <a href='/games/${game.slug}/'>
                          <img src="${game.thumbnail}" class="thumbnail" loading="lazy" />
                          <text class="centerthing">${game.name}</text>
                      </a>
                  </div>`
        )
        .join("");

    const recentlyAddedHTML = buildCarouselHTML(listing.reverse());
    const allGamesHTML = listing
      .map(
        (game) => `
              <div class="game-icon centered">
                  <a href='/games/${game.slug}/'>
                      <img src="${game.thumbnail}" class="min-img" />
                      <text class="centerthing">${game.name}</text>
                  </a>
              </div>`
      )
      .join("");

    const popularHTML = buildCarouselHTML(
      listing.filter((game) =>
        popularGames.some((p) => p.game.includes(`/games/${game.slug}/`))
      )
    );

    return {
      recentlyAdded: recentlyAddedHTML,
      mostPlayed: popularHTML,
      allGames: allGamesHTML,
    };
  } catch (error) {
    console.error('Error loading games:', error);
    return { error: "Failed to load games" };
  }
}

// app.get("/games/", (req, res) => {
//   // Updates the games list every 30 minutes (in ms)
//   if (Date.now() - constructedGamesListJSONTimestamp > 1800000) {
//     constructGamesListJSON();
//   }

//   res.setHeader("content-type", "application/json");
//   res.send(constructedGamesListJSON);
// });

// // Instead of adding stuff for EVERY index html,
// // just add it from the server side...

function handleGamesServing(req, res, concatIndex) {
  res.setHeader("Content-Type", "text/html");

  updateCount(`/games/${req.query.game}/`, "starts");

  const safeUrl = path.normalize(req.originalUrl);

  var filePath;
  if (concatIndex) {
    filePath = path.join(__dirname, "public", safeUrl, "index.html");
  } else {
    filePath = path.join(__dirname, "public", safeUrl);
  }

  const ipAddress = req.ip;
  const now = new Date();

  console.log(
    now.toISOString() + ":" + ipAddress + ": Serving file: " + filePath
  );

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log(
          now.toISOString() +
          ":" +
          ipAddress +
          ": Error, file not found: " +
          filePath
        );
        res.sendStatus(404);
      } else {
        console.log(
          now.toISOString() + ":" + ipAddress + ": Error reading file: " + err
        );
        res.sendStatus(500);
      }
      return;
    }

    res.send(`${data}${report}`);
  });
}

app.get("/games/:game/index.html", (req, res) => {
  handleGamesServing(req, res, false);
});

app.get("/games/:game/", (req, res) => {
  handleGamesServing(req, res, true);
});


function randomElement(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getRandomCombination() {
  return `${randomElement(ADJECTIVES)}${randomElement(NOUNS)}`;
}

function updateCount(path, key) {
  if (!pathStats[path]) {
    pathStats[path] = { starts: 0, recurring: 0 };
  }

  pathStats[path][key]++;

  if (+Date.now() - lastSavedPathStats > 60 * 1000) {
    lastSavedPathStats = +Date.now();

    try {
      fs.writeFileSync("path-stats.json", JSON.stringify(pathStats));
      const now = new Date();
      console.log(`${now.toISOString()}: Success: Saved path-stats.json`);
    } catch (err) {
      console.error(err);
    }
  }
}

function updateIndex() {
  if (+Date.now() - lastUpdatedIndex > 60 * 1000) {
    console.log("UP3 INDEX")
    lastUpdatedIndex = +Date.now();
    const filePath = path.join(__dirname, 'private', 'index.html');
    const replacementInfo = loadAllGames();

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading index.html:', err);
        return;
      }
      indexHtml = data
        .replace("{recentlyAddedCarousel}", replacementInfo.recentlyAdded)
        .replace("{mostPlayCarousel}", replacementInfo.mostPlayed)
        .replace("{allGames}", replacementInfo.allGames);
      // console.log('index.html updated.');
    });
  }
}

app.get("/stats", (req, res) => {
  res.send(pathStats);
});

function affixSlash(path) {
  path = path.trim();
  if (path.endsWith("/")) {
    return path;
  }
  return `${path}/`;
}

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

app.get("/live-chat/active", (req, res) => {
  res.setHeader("content-type", "application/json");
  res.send(accs_vanities);
});

app.ws("/live-chat-ws", function (ws, req) {
  let thisUser = {};
  thisUser.connected = true;
  thisUser.needsRemovalOnDisconnect = true;
  thisUser.lastPingReturned = +Date.now();

  thisUser.pingTimeout = setTimeout(function go() {
    // Basically a set interval
    if (!thisUser.connected) {
      if (thisUser.needsRemovalOnDisconnect) {
        removeUser(thisUser);
      }
      return; // Don't set the next timeout since they left (or disconnected unintentionally)
    } else {
      ws.send(JSON.stringify({ type: "ping" }));
      if (+Date.now() - thisUser.lastPingReturned > PING_TIMEOUT + 5000) {
        console.log(
          `${thisUser.name}'s last ping was more than 15 seconds ago, disconnecting and closing websocket.`
        );
        thisUser.connected = false;
        thisUser.needsRemovalOnDisconnect = false;

        removeUser(thisUser);
        ws.close();
      }
    }
    thisUser.pingTimeout = setTimeout(go, 5000);
  }, 5000);

  activeUsers++;

  const removeUser = (user) => {
    const index = accs.indexOf(user.name);
    if (index !== -1) {
      accs.splice(index, 1);
      accs_vanities.splice(index, 1);
      websockets.splice(index, 1);
      console.log(`User removed: ${user.name}`);
      var message = {
        decodedMessage: `${user.vanity} has left the chat!`,
      };
      sendToChannel(user.channel, message, null);
    } else {
      console.log("User not found in users list!");
    }
  };

  const sendToChannel = (channel, message, senderHash) => {
    sendMessageToWebHook(
      `${accs_vanities[accs.indexOf(message.sender)]}: ${message.decodedMessage
      } ${getCurrentTime()}`
    );
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
    thisUser.connected = false;
  });

  ws.on("message", async function (msg) {
    const message = JSON.parse(msg);
    const ipAddress = req.ip;
    const now = new Date();

    // If they send anything back that means
    // they are still connected...
    thisUser.lastPingReturned = +Date.now();

    switch (message.type) {
      case "names":
        ws.send(
          JSON.stringify({
            type: "nameslist",
            value: JSON.stringify(accs_vanities),
          })
        );
        break;

      case "tempacc":
        // I would do it by ip normally but everyone has the same ip...
        if (blockedUIDs.includes(message.name) || message.name.length != 20) {
          thisUser.connected = false;
          thisUser.needsRemovalOnDisconnect = false;
          ws.send(JSON.stringify({ type: "blocked" }));
          return;
        }

        thisUser = message;
        thisUser.connected = true;
        thisUser.needsRemovalOnDisconnect = true;
        thisUser.lastPingReturned = +Date.now();

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
          if (
            decodedMessage.trim() === "" ||
            decodedMessage.trim().length > 2001
          ) {
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
      case "ping":
        break;
      default:
        ws.send(JSON.stringify({ type: "unknowntype", value: message.type }));
    }
  });
});

updateIndex();
app.use("/", function (req, res, next) {
  if (req.url === "/") {
    console.log("log");
    updateIndex();
    res.send(indexHtml);
  } else {
    next();
  }
});

app.use(express.static("public"));

if (!DEBUG) {
  app.listen(PORT);
} else {
  app.listen(PORT, '0.0.0.0');
}