// ik this looks weird but later there will probably be a bunch of stuff like this

const fs = require("fs");

var DEBUG = false;
if (fs.existsSync('./debug.txt')) {
  DEBUG = true;
}

var certoptions;
if (!DEBUG) {
    certoptions = {
        key: fs.readFileSync('/etc/letsencrypt/live/www.project-sentinel.xyz/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/www.project-sentinel.xyz/fullchain.pem')
    };
} else {
    certoptions = {}
}

function affixSlash(path) {
    path = path.trim();
    if (path.endsWith("/")) {
        return path;
    }
    return `${path}/`;
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

function timedLog(text) {
    const now = new Date();
    console.log(`${now.toISOString()}: ${text}`);
}

function timedError(text) {
    const now = new Date();
    console.error(`${now.toISOString()}: ${text}`);
}


// function timedLogWithIP() {
    
// }

module.exports = {
    affixSlash: affixSlash,
    getCurrentTime: getCurrentTime,
    timedLog: timedLog,
    timedError: timedError,
    DEBUG: DEBUG,
    certoptions
}