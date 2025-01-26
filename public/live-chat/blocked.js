var allowedToChat = document.getElementById("allowed-to-chat");
var blockedTime   = localStorage.getItem("blocked_time");

if(blockedTime == null) {
    allowedToChat.innerText = allowedToChat.innerText.replace("...", "an undetermined amount of time.");
} else {
    console.log(JSON.parse(blockedTime));
}