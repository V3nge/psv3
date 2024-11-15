var settingsList = document.getElementById("settingsList");
var sfxTime = +Date.now();
const allGamesList = document.getElementById('allGames');

function loadAllGames() {
    var example = {
        src: "images/minecraft.jpg", 
        text: "minecraft"
    };
    const games = Array.from({ length: 10000 }, (_, i) => example);
    const built = games.map(game => `<div class="game-icon centered"><img src="${game.src}" class="min-img"></img></div>`).join('');
    allGamesList.innerHTML = built;
}


function animeGirl() {
    if((+Date.now() - sfxTime) > 1000) {
        sfxTime = +Date.now();
        var sfx = ["cute-uwu.mp3", "anime-wow-sound-effect.mp3", "yes-daddy_CKEAffI.mp3"];
        var effect = sfx[Math.round(Math.random()*(sfx.length-1))];
        (new Audio(`/sfx/${effect}`)).play();
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
loadAllGames();