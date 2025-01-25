function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

var uid = localStorage.getItem("ai_uid");
if (uid == null) {
    uid = generateRandomString(20);
    localStorage.setItem("ai_uid", uid);
}

const messagesContainer = document.getElementById("messages");
var liveChatDialogLink = document.getElementById("live-chat-dialog-link");

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
    return `rgb(${r / 2}, ${g / 2}, ${b / 2})`;
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

function dualLog(a) {
    console.log(a);
    createMessage("System", a, false);
}

async function send() {
    var inputBox = document.getElementById("input-box");
    var messageText = inputBox.value;
    inputBox.value = "";
    if (messageText.trim() != "" && messageText.length < 300) {
        createMessage("User", messageText, true);
        var res = await (await fetch(`/ai?t=${encodeURIComponent(messageText)}&u=${uid}`)).json();
        createMessage("Sentinel Ai", res.response, true);
    } else {
        alert("Invalid input >:(");
    }
}

function back() {
    window.location.href = "/"; // omg so pro
}

createMessage("Sentinel Ai", "Welcome to Sentinel Ai. I am here to assist you with any queries or tasks you may have. Feel free to ask me anything, and I will do my best to help you. How can I assist you today?", true);