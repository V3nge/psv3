const fs = require("fs");

let configuration;
if (!fs.existsSync("config.json")) {
    console.log("It looks like your first time running psv3! So,");
    configuration = require("../setup").setup();
} else {
    configuration = JSON.parse(fs.readFileSync("config.json", { encoding: 'utf8', flag: 'r' }));
}

const DEBUG = configuration.environment === "dev"; // Fixed typo: 'enviornment' -> 'environment'

const certoptions = {};
if (!DEBUG) {
    certoptions = {
        key: fs.readFileSync('/etc/letsencrypt/live/www.project-sentinel.xyz/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/www.project-sentinel.xyz/fullchain.pem')
    };
}

function affixSlash(path) {
    path = path.trim();
    return path.endsWith("/") ? path : `${path}/`;
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return ` (${hours}:${formattedMinutes} ${ampm})`;
}

function timedLog(text) {
    console.log(`${new Date().toISOString()}: ${text}`);
}

function timedError(text) {
    console.error(`${new Date().toISOString()}: ${text}`);
}

module.exports = {
    affixSlash,
    getCurrentTime,
    timedLog,
    timedError,
    DEBUG,
    config: configuration,
    certoptions
};