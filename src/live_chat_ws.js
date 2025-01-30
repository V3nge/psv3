const { getRandomCombination } = require("./chat_name_generator");
const { getCurrentTime, DEBUG } = require("./shared");
const crypto = require("crypto");

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}

function setup(app) {
    const PING_TIMEOUT = 10000;
    var accs_vanities = [];
    var activeUsers = 0;
    var blockedUIDs = [];
    var websockets = [];
    var rooms = [];
    var accs = [];

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
                        atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMyODEzMTUwODQ5NzU1MTQwMS9NTmMzNlZ4VDBzRFFvQUN0b01UV1RSNm9pZU1HRHZ3ZHY2NkF3ZmVFZW5vSElyR2VkSlNGRXlORFdyUTg4aTJQUnM4MA=="),
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

    function createPrivateRoom(name) {
        rooms.push(name);
        return `${encodeURIComponent(name)}`;
    }

    var uidFromIp = false;
    app.ws("/live-chat-ws", function (wss, req) {
        let thisUser = {};

        let messagesSent = 0;

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
                wss.send(JSON.stringify({ type: "ping" }));
                if (+Date.now() - thisUser.lastPingReturned > PING_TIMEOUT + 5000) {
                    clearInterval(messagesLimitInterval);

                    console.log(
                        `${thisUser.name}'s last ping was more than 15 seconds ago, disconnecting and closing websocket.`
                    );
                    thisUser.connected = false;
                    thisUser.needsRemovalOnDisconnect = false;

                    removeUser(thisUser);
                    wss.close();
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

        wss.on("close", async function (err) {
            clearInterval(messagesLimitInterval);
            activeUsers--;
            removeUser(thisUser);
            thisUser.connected = false;
        });

        let messagesLimitInterval = setInterval(function () {
            messagesSent = 0;
        }, 1000);

        wss.on("message", async function (msg) {
            // Much better. Goes by the amount per second instead of average per second.
            // Going by average per second means that if you have only been in the chat 0.01 seconds
            // and send a message, that that would be 1 message every 0.01 seconds which is 100 messages a second.
            // Not ideal.
            if (messagesSent > 5) {
                console.log(
                    `${thisUser.name} sent more than 30 messages a second through the websocket!!`
                );
                blockedUIDs.push(thisUser.name);
                // Unblock after 10 minutes
                const timeBlocked = 1000 * 60 * 10;
                setTimeout(function () {
                    blockedUIDs.splice(blockedUIDs.indexOf(thisUser.name), 1);
                }, timeBlocked);
                wss.send(JSON.stringify({ "type": "block_time", "time": timeBlocked, "start": (+Date.now()) }));
                wss.send(JSON.stringify({ "type": "blocked" }));
                wss.close();
                return;
            } else {
                messagesSent++;
            }

            const message = JSON.parse(msg);

            const ipAddress = req.ip;
            console.log(ipAddress);

            const now = new Date();

            // If they send anything back that means
            // they are still connected...
            thisUser.lastPingReturned = +Date.now();

            switch (message.type) {
                case "names":
                    wss.send(
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
                        wss.send(JSON.stringify({ type: "blocked" }));
                        return;
                    }

                    thisUser = message;


                    if (uidFromIp) {
                        message.name = req.ip;
                        message.sender = req.ip;
                        thisUser.name = req.ip;
                    }

                    console.log("TEMPACC", thisUser.name);

                    thisUser.connected = true;
                    thisUser.needsRemovalOnDisconnect = true;
                    thisUser.lastPingReturned = +Date.now();

                    wss.send(JSON.stringify({ type: "ok_tempacc" }));

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

                    websockets.push({ socket: wss, channel: message.channel });
                    thisUser.websocket = { socket: wss, channel: message.channel };
                    break;

                case "tempacc_gsend":
                    if (uidFromIp) {
                        message.name = req.ip;
                        message.sender = req.ip;
                        thisUser.name = req.ip;
                    }

                    if (accs.includes(message.sender)) {
                        const decodedMessage = decodeURIComponent(message.msg);
                        if (
                            decodedMessage.trim() === "" ||
                            decodedMessage.trim().length > 2001
                        ) {
                            wss.send(JSON.stringify({ type: "nuh uh" }));
                            break;
                        }
                        wss.send(JSON.stringify({ type: "ok" }));

                        message.decodedMessage = decodedMessage;

                        const senderHash = await sha256(message.sender);

                        console.log(message);
                        console.log(decodedMessage);

                        sendToChannel(message.channel, message, senderHash);
                    } else {
                        console.log(message.sender);
                        wss.send(JSON.stringify({ type: "nuh uh" }));
                    }
                    break;

                case "newpri":
                    const senderHash = await sha256(message.sender);
                    wss.send(
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
                    wss.send(JSON.stringify({ type: "unknowntype", value: message.type }));
            }
        });
    });
}

module.exports = {
    setup: setup
}