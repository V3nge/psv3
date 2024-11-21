const messagesContainer = document.getElementById("messages");
var ws = new WebSocket(`ws://${window.location.host}/live-chat-ws`);

function createTextShadow(c) { 
    return `${c} -2px -2px, ${c} -2px -1px, ${c} -2px 0px, ${c} -2px 1px, ${c} -2px 2px, ${c} -1px -2px, ${c} -1px -1px, ${c} -1px 0px, ${c} -1px 1px, ${c} -1px 2px, ${c} 0px -2px, ${c} 0px -1px, ${c} 0px 0px, ${c} 0px 1px, ${c} 0px 2px, ${c} 1px -2px, ${c} 1px -1px, ${c} 1px 0px, ${c} 1px 1px, ${c} 1px 2px, ${c} 2px -2px, ${c} 2px -1px, ${c} 2px 0px, ${c} 2px 1px, ${c} 2px 2px`;
}

function stringToRGB(input) {
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
        }
        return hash;
    }
    const hash = Math.abs(hashString(input));
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff; 
    const b = hash & 0xff;
    return `rgb(${r/2}, ${g/2}, ${b/2})`;
}

const joinMessages = [
    "Lo, I hath entered thy presence!",
    "I have arrived.",
    "By decree of fate, I am here!",
    "Hark! A new soul graces this hall.",
    "I cometh bearing tidings and wit!",
    "Thy ally hath arrived upon the field.",
    "Let it be known, I have joined thy ranks.",
    "By the stars above, I stand amongst thee.",
    "Sound the horns, for I have come!",
    "The gates are opened, and I step within.",
    "Behold, for I have graced this gathering.",
    "Prepare thy ears, for my voice is now among thee!",
    "I am summoned, and here I stand.",
    "A wanderer no more, I join thy company.",
    "From lands afar, I make my way to thee.",
    "The fates hath led me to this noble assembly.",
    "A knight of words and deeds arrives!",
    "Lo and behold, a kindred soul joins the fray.",
    "Fear not, for I come in peace and purpose.",
    "The hour is nigh, and I am here at last.",
    "Rejoice, for thy comrade is at thy side!",
    "My quest bringeth me to thy hallowed halls.",
    "With courage in heart, I step into thy midst.",
    "The heralds of time hath delivered me hence.",
    "Raise thy goblets; I am now among thee.",
    "Through trials and tribulations, I find myself here.",
    "A shadow no longer, I stand in thy light.",
    "Mark this day; I hath joined thy noble cause.",
    "By the grace of the heavens, I am arrived.",
    "Gather round, for I bring wisdom and mirth!",
    "Thy fellowship welcomes a new companion this day.",
    "Hide thy mead, for I have entered!",
    "Fear not, peasants, 'tis only I.",
    "I have arrived, and yes, my horse parked itself.",
    "Aye, 'tis I, the hero of legends… and bad decisions.",
    "The prophecy spoke of my arrival. They weren’t wrong.",
    "Make way! Or don’t. I’m already here.",
    "Lo, I cometh… mostly for the food.",
    "Gather round! I bring wit, wisdom, and snacks!",
    "I hath joined… but where art the dragons?",
    "Rejoice! For I bring tales of glory and debt!",
    "Tarry no longer! I am here to spice thy lives!",
    "I hath journeyed far… mostly to avoid chores.",
    "A wild knight appears! What shall ye do?",
    "Behold, thy favorite fool hath arrived!",
    "Worry not; I only bite when provoked.",
    "Dust off thy banquet table—I come hungry and uninvited!",
    "I hath arrived… but forgot why I came.",
    "Lo, a jester in armor joins the fray!",
    "I enter with courage in heart and ale on breath.",
    "Announce me properly, lest I cry!",
    "By my troth, I hath finally figured out the door.",
    "Aha! Thy merry mischief-maker is among thee now!",
    "Fear not! I bring neither harm nor unpaid debts.",
    "I have come bearing… well, just myself. Deal with it.",
    "At long last, the true star of this gathering arrives!",
    "Verily, I am here! Where art the snacks?",
    "The legends were true—I hath arrived, fashionably late as always!"
];

var uid = JSON.stringify(Math.round(Math.random() * 999999999999));

var urlParams = new URLSearchParams(window.location.search);
var channelToSendTo = urlParams.get('c');

ws.onopen = function () {
    ws.send(JSON.stringify({ "type": "tempacc", "name": uid, "channel": channelToSendTo, "vanity": playNameClient }));
}

function createMessage(name, value, userMessage = true) {
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
    messagePTag.style.textShadow = createTextShadow(stringToRGB(name));
    message.appendChild(messagePTag);
    messagesContainer.appendChild(message);
}

var hashes = [];
var liveChatDialogLink = document.getElementById("live-chat-dialog-link");

ws.onclose = function() {
    alert("Uh oh! Your websocket disconnected... 😦");
}

ws.onerror = function() {
    alert("OH SHOOT! There was an error... 😦😦😦");
}

var playNameClient = prompt("> Enter name for chat");

ws.onmessage = function (a) {
    var response = JSON.parse(a.data);
    if (response.type == "ok_tempacc") {
        console.log("ok tempacc")
        const randomMsg = Math.floor(Math.random() * joinMessages.length);
        ws.send(JSON.stringify({
            "type": "tempacc_gsend",
            "msg": encodeURIComponent(joinMessages[randomMsg]),
            "sender": uid,
            "channel": channelToSendTo,
            "vanity": playNameClient
        }));
    } else if (response.type == "gsend_r") {
        if (!hashes.includes(response.sender)) {
            hashes.push(response.sender);
        }
        var senderer = hashes.indexOf(response.sender);
        if (senderer == 0) {
            createMessage(response.sender, `You: ${decodeURIComponent(response.msg)}`);
        } else {
            console.log(response);
            createMessage(response.sender, `${response.vanity}: ${decodeURIComponent(response.msg)}`);
        }
    } else if (response.type == "pri") {
        var url = `${window.location.origin}/live-chat?c=${response.msg}`;
        createMessage("System", `<a href="${url}">Your private chat: ${response.msg}</a>`, false);
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
    if (messageText.trim() != "" && messageText.length < 2001) {
    if (messageText == "!np") {
        createPrivate(encodeURIComponent(prompt("code > ")));
    } else if(messageText == "!jp") {
        window.location.href = `/live-chat/?c=${encodeURIComponent(prompt("code > "))}`;
    } else if(messageText == "!njp") {
        var encoded = encodeURIComponent(prompt("code > "));
        createPrivate(encoded);
        window.location.href = `/live-chat/?c=${encoded}`;
    } else{
        console.log(JSON.stringify({
            "type": "tempacc_gsend", "msg": encodeURIComponent(messageText), "sender": uid,
            "channel": channelToSendTo, "vanity": playNameClient
        }));
        ws.send(JSON.stringify({
            "type": "tempacc_gsend", "msg": encodeURIComponent(messageText), "sender": uid,
            "channel": channelToSendTo, "vanity": playNameClient
        }));
    }
} else {
    alert("Invalid input >:(");
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