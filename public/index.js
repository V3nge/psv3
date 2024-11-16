// var click = new Audio("sfx/click.mp3");
// click.volume = 0.1;

var settingsList = document.getElementById("settingsList");
var sfxTime = +Date.now();
var inGame = false;
var gameIframe = null;

function animeGirl() {
    if((+Date.now() - sfxTime) > 1000) {
        sfxTime = +Date.now();
        var sfx = ["anime-wow-sound-effect.mp3", "cute-uwu.mp3", "yes-daddy_CKEAffI.mp3", "ara-ara-sound-effect-127279.mp3", "anime-cat-girl-105182.mp3", "onii-chan-187125.mp3"];
        var effect = sfx[Math.round(Math.random()*(sfx.length-1))];
        var audio = (new Audio(`/sfx/${effect}`))
        audio.volume = 1; 
        audio.play();
    }
}

function saveSettings(save) {
    var settingsElements = Array.prototype.slice.call(document.getElementsByClassName("settingsInput"));
    settingsElements.forEach(settingElement => {
        if(settingElement.type == "checkbox") {
            console.log(settingElement.name, settingElement.checked);
            localStorage.setItem(`psv3_settings_${settingElement.name}`, settingElement.checked);
        } else {
            console.log(`Unknown type: ${settingElement.type}, not saving this data.`);
        }
    });
}

var backgroundDegrees = 0;
var start = +Date.now();
var last  = start;

function update() {
    last = start;
    start = +Date.now();
    backgroundDegrees -= ((start - last) / (80 + (Math.random() * 20)));
    backgroundDegrees %= 360;
    document.body.style.background = `linear-gradient(${backgroundDegrees}deg, rgba(4,1,18,1) 0%, rgb(17, 5, 44) 100%)`;
    requestAnimationFrame(update);
}

requestAnimationFrame(update);