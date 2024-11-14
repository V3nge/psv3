var sfxTime = +Date.now();

function animeGirl() {
    if((+Date.now() - sfxTime) > 1000) {
        sfxTime = +Date.now();
        var sfx = ["cute-uwu.mp3", "anime-wow-sound-effect.mp3", "yes-daddy_CKEAffI.mp3"];
        var effect = sfx[Math.round(Math.random()*(sfx.length-1))];
        (new Audio(`/sfx/${effect}`)).play();
    }
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