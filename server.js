// comment that counts as an "update", restarting the server;

const fs = require("fs");

// wow thats a lot of libraries
var { app, express, listenCallback, startProxy } = await(require('./src/init').init(DEBUG));
const { createCompletion } = require('./src/ai');
const { affixSlash, timedError, timedLog, DEBUG, config } = require('./src/shared');
const Fuse = require("fuse.js");
const path = require("path");

if (config.httpmin) {
  require('./src/httpmin'); // start HTTP-min server
}

var report = fs.readFileSync(path.join(__dirname, `private/report.html`));
var constructedGamesListJSON = null;
var lastSavedPathStats = +Date.now();
var lastUpdatedIndex = 0;
var pathStats = {};
var indexHtml = ""

// var proxy = httpProxy.createProxyServer({});

// var server = http.createServer(function (req, res) {
//     proxy.web(req, res, { target: 'http://youtube.com/' });
// });

// server.listen(6969);

try {
  const data = fs.readFileSync("path-stats.json");
  pathStats = JSON.parse(data);
  timedLog(`Success: Loaded path-stats.json`);
} catch (err) {
  timedError(`Error, file not found: path-stats.json`);
}

const logDirectory = path.join(__dirname, 'error-logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

app.post('/error', (req, res) => {
  timedLog("no sigma3")
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
// const morgan = require('morgan');
// app.use(helmet());
// app.use(morgan('combined'));

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

  const safeUrl = path.normalize(req.originalUrl);

  var filePath;
  if (concatIndex) {
    filePath = path.join(__dirname, "public", safeUrl, "index.html");
  } else {
    filePath = path.join(__dirname, "public", safeUrl);
  }

  const ipAddress = req.ip;

  timedLog(`${ipAddress}: Serving file: ${filePath}`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        timedLog(`${ipAddress}: Error, file not found: ${filePath}`);
        res.sendStatus(404);
      } else {
        timedError(`${ipAddress}: Error reading file: ${err}`);
        res.sendStatus(500);
      }
      return;
    }

    res.send(`${data}${report}`);
  });
}

app.get("/games/:game/index.html", (req, res) => {
  updateCount(req.path, "starts");
  handleGamesServing(req, res, false);
});

app.get("/games/:game/", (req, res) => {
  updateCount(req.path, "starts");
  handleGamesServing(req, res, true);
});

function getCircularReplacer() {
  const ancestors = [];
  return function (key, value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(value)) {
      return "[Circular]";
    }
    ancestors.push(value);
    return value;
  };
}

app.get("/dashboard/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'logindashboard.html'));
});

app.post("/api/dashboard/login", (req, res) => {
  res.send(JSON.stringify({ "success": true, "username": `${req.body['username']}`, "sentbody": req }, getCircularReplacer()));
});

function randomElement(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function updateCount(path, key) {
  if (!pathStats[path]) {
    pathStats[path] = { starts: 0, recurring: 0 };
  }

  pathStats[path][key]++;

  if ((+Date.now()) - lastSavedPathStats > 60 * 1000) {
    lastSavedPathStats = (+Date.now());

    try {
      fs.writeFileSync("path-stats.json", JSON.stringify(pathStats));
      timedLog(`Success: Saved path-stats.json`);
    } catch (err) {
      console.error(err);
    }
  }
}

function updateIndex() {
  if ((+Date.now()) - lastUpdatedIndex > 60 * 1000) {
    timedLog(`Updating server rendered index.html`);
    lastUpdatedIndex = (+Date.now());
    const filePath = path.join(__dirname, 'private', 'index.html');
    const replacementInfo = loadAllGames();

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        timedError(`Error reading index.html: ${err}`);
        return;
      }
      indexHtml = data
        .replace("{recentlyAddedCarousel}", replacementInfo.recentlyAdded)
        .replace("{mostPlayCarousel}", replacementInfo.mostPlayed)
        .replace("{allGames}", replacementInfo.allGames);
      // timedLog('index.html updated.');
    });
  }
}

app.get("/stats", (req, res) => {
  updateCount("/", "starts"); // because stats is loaded on /, this will be indicative of a full page load
  res.send(pathStats);
});

var aiUsages = {};
var aiMessagesSent = {};
app.get('/ai', async (req, res) => {
  const messageText = req.query.t;

  if (!messageText) {
    return res.status(400).json({
      success: false,
      error: "Missing 't' query parameter."
    });
  }

  const uid = req.query.u;

  if (!uid) {
    return res.status(400).json({
      success: false,
      error: "Missing 'u' query parameter."
    });
  }

  if (messageText.trim() == "" || messageText.length > 300) {
    return res.status(400).json({
      success: false,
      error: "Invalid input.",
      response: "Sorry, your input could not be processed."
    });
  }

  if (aiUsages[uid] == undefined) {
    aiUsages[uid] = 0;
    aiMessagesSent[uid] = [
      { role: "system", content: "You are a helpful ai for Project Sentinel. You are the 'Sentinel Ai'. Only call yourself 'Sentinel Ai'. Whenever someone asks a question, be as useless as possible." },
    ];
  }
  // else {
  //   if (((Math.random() * 100) > 70) && aiUsages[uid] > 2) {
  //     // the first 2 messages are all good and dandy
  //     return res.status(500).json({
  //       success: false,
  //       error: "Internal Error.",
  //       response: "Sorry, your input could not be processed. Please try again in a second."
  //     });
  //   }
  // }

  aiUsages[uid]++;

  if (aiUsages[uid] > 5) {
    res.json({
      success: true,
      input: messageText,
      response: "You've reached your max quota for the day. Sign up for Sentinel Ai premium to get more access and better responses. [Project Sentinel will likely increase the cap at some point.]"
    });
    return;
  }

  aiMessagesSent[uid].push({
    role: "user",
    content: messageText,
  });

  try {
    var complete = (await createCompletion(aiMessagesSent[uid]));

    if (complete.type == "insufficient_quota") {
      res.json({
        success: false,
        input: messageText,
        response: "Sorry, Sentinel Ai cannot be used at this time. (E:InsQua)"
      });
    }

    // How the Ai responded
    aiMessagesSent[uid].push({
      role: "assistant",
      content: complete.content.trim(),
    });

    res.json({
      success: true,
      input: messageText,
      response: complete.content.trim()
    });
  } catch (error) {
    res.json({
      success: false,
      input: messageText,
      response: "Please try again."
    });
    aiMessagesSent[uid] = [
      { role: "system", content: "You are a helpful ai for Project Sentinel. You are the 'Sentinel Ai'. Only call yourself 'Sentinel Ai'. Whenever someone asks a question, be as useless as possible." },
    ];
    console.error("Error with ChatGPT API:", error);
  }
});

app.post("/r", (req, res) => {
  const path = affixSlash(req.query.u);
  if (!path) {
    return res.status(400).send({ error: "Path is required" });
  }
  updateCount(path, "recurring");
  res.send();
});

app.get("/check_room", (req, res) => {
  res.setHeader("content-type", "application/json");
  res.send(rooms.includes(req.query.id));
});

var codesFound = [];
app.get("/api/fndcof", (req, res) => {
  res.setHeader("content-type", "application/json");
  codesFound.push(req.query.c);
  timedLog(codesFound);
  res.send("true");
})

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

// https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
// this particular solution is sync
const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

app.use("/lucky", function (req, res) {
  var directories = getDirectories("public/games");
  var randomDirectory = randomElement(directories);
  res.send(`<script>window.location.href="/games/${randomDirectory}";</script>`)
});

app.get("/live-chat/active", (req, res) => {
  res.setHeader("content-type", "application/json");
  res.send(accs_vanities);
});

app.get('/games-a-tags', (req, res) => {
  res.setHeader("content-type", "text/html");
  var result = "";
  constructedGamesListJSON.forEach(element => {
    result += `<a href="/games/${element.slug}/">${element.name}</a>&nbsp;&nbsp;&nbsp;&nbsp;`
  });
  res.send(result);
});

require("./src/live_chat_ws").setup(app);

updateIndex();
app.use("/", function (req, res, next) {
  if (req.url === "/") {
    updateIndex();
    res.send(indexHtml);
  } else {
    next();
  }
});

startProxy();

app.use(express.static("public"));

timedLog("Starting server via listenCallback...");
listenCallback();

