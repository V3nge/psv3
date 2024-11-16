const messagesContainer = document.getElementById("messages");
var ws = new WebSocket("/live-chat-ws");

var uid = JSON.stringify(Math.round(Math.random()*999999999999));

ws.onopen = function() {
    ws.send(JSON.stringify({"type": "tempacc", "name": uid}));
}

function createMessage(value) {
    var message = document.createElement("div");
    message.classList = ["message"];
    var messagePTag = document.createElement("pre");
    messagePTag.innerText = value;
    message.appendChild(messagePTag);
    messagesContainer.appendChild(message);
}

var hashes = [];

ws.onmessage = function(a) {
    var response = JSON.parse(a.data);
    if(response.type == "ok_tempacc") {
        console.log("ok tempacc")
        ws.send(JSON.stringify({
            "type": "tempacc_gsend",
            "msg": encodeURIComponent("Hello!"),
            "sender": uid
        }));
    } else if(response.type == "gsend_r") {
        var senderer = hashes.indexOf(response.sender);
        if(!hashes.includes(response.sender)) {
            hashes.push(response.sender);
        }
        if(senderer == 0) {
            createMessage(`You: ${decodeURIComponent(response.msg)}`);
        } else {
            createMessage(`Person ${hashes.indexOf(response.sender)}: ${decodeURIComponent(response.msg)}`);
        }
    } else {
        console.log(response);
    }
}

function send() {
    var inputBox = document.getElementById("input-box");
    var messageText = inputBox.value;
    inputBox.value = "";
    ws.send(JSON.stringify({"type":"tempacc_gsend","msg":encodeURIComponent(messageText),"sender":uid}));
}