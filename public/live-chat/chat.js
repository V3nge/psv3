const messagesContainer = document.getElementById("messages");
var ws = new WebSocket("/live-chat-ws");

var uid = JSON.stringify(Math.round(Math.random() * 999999999999));

var urlParams = new URLSearchParams(window.location.search);
var channelToSendTo = urlParams.get('c');

ws.onopen = function () {
    ws.send(JSON.stringify({ "type": "tempacc", "name": uid, "channel": channelToSendTo }));
}

function createMessage(value, userMessage = true) {
    var message = document.createElement("div");
    if (userMessage) {
        message.classList = ["message"];
    } else {
        message.classList = ["system-message"];
    }
    if (userMessage) {
        var messagePTag = document.createElement("pre");
        messagePTag.innerText = value;
    } else {
        var messagePTag = document.createElement("p");
        messagePTag.innerHTML = value;
    }
    message.appendChild(messagePTag);
    messagesContainer.appendChild(message);
}

var hashes = [];
var liveChatDialogLink = document.getElementById("live-chat-dialog-link");

ws.onmessage = function (a) {
    var response = JSON.parse(a.data);
    if (response.type == "ok_tempacc") {
        console.log("ok tempacc")
        ws.send(JSON.stringify({
            "type": "tempacc_gsend",
            "msg": encodeURIComponent("Hello!"),
            "sender": uid,
            "channel": channelToSendTo
        }));
    } else if (response.type == "gsend_r") {
        var senderer = hashes.indexOf(response.sender);
        if (!hashes.includes(response.sender)) {
            hashes.push(response.sender);
        }
        if (senderer == 0) {
            createMessage(`You: ${decodeURIComponent(response.msg)}`);
        } else {
            createMessage(`Person ${hashes.indexOf(response.sender)}: ${decodeURIComponent(response.msg)}`);
        }
    } else if (response.type == "pri") {
        var url = `${window.location.origin}/live-chat?c=${response.msg}`;
        createMessage(`<a href="${url}">Your private chat: ${response.msg}</a>`, false);
        liveChatDialogLink.href = url;
        liveChatDialogLink.innerText = url;
    } else {
        console.log(response);
    }
}

function createPrivate(name) {
    ws.send(JSON.stringify({ "type": "newpri", "code": name }));
}

function send() {
    var inputBox = document.getElementById("input-box");
    var messageText = inputBox.value;
    inputBox.value = "";
    if (messageText == "!np") {
        createPrivate(encodeURIComponent(prompt("code > ")));
    } else if(messageText == "!jp") {
        window.location.href = `/live-chat/?c=${encodeURIComponent(prompt("code > "))}`;
    } else if(messageText == "!njp") {
        var encoded = encodeURIComponent(prompt("code > "));
        createPrivate(encoded);
        window.location.href = `/live-chat/?c=${encoded}`;
    } else{
        ws.send(JSON.stringify({
            "type": "tempacc_gsend", "msg": encodeURIComponent(messageText), "sender": uid,
            "channel": channelToSendTo
        }));
    }
}

var codeInput = document.getElementById("code-input");

async function joinCode() {
    var encoded = encodeURIComponent(codeInput.value);
    if(await (await fetch(`/check_room?id=${encoded}`)).json()) {
        window.location.href = `/live-chat/?c=${encoded}`;
    } else {
        createPrivate(codeInput.value);
        setInterval(function() {
            window.location.href = `/live-chat/?c=${encoded}`;
        }, 1000);
    }
}

function back() {
    window.location.href = "/"; // omg so pro
}