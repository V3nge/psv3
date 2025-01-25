// var click = new Audio("sfx/click.mp3");
// click.volume = 0.1;

alert("It has come to our attention that a few people have been claiming to own this website. Unfortunately, they are liars. Some of you know who the actual owners are, congrats. The only way someone can prove they own the website is by changing the website for everyone. I only tell people I trust that I own this... I wouldn't just send out an email saying I made it... whoever emailed you it was lying. Keep in mind, I have nothing against this person, his intentions were good. Do not think less of them.");

var settingsList = document.getElementById("settingsList");
var sfxTime = +Date.now();
var inGame = false;
var gameIframe = null;
var backgroundDegrees = 0;
var startTimestamp = +Date.now();
var lastTimestamp = startTimestamp;

function animeGirl() {
    if ((+Date.now() - sfxTime) > 1000) {
        sfxTime = +Date.now();
        var sfx = ["anime-wow-sound-effect.mp3", "cute-uwu.mp3", "yes-daddy_CKEAffI.mp3", "ara-ara-sound-effect-127279.mp3", "anime-cat-girl-105182.mp3", "onii-chan-187125.mp3"];
        var effect = sfx[Math.round(Math.random() * (sfx.length - 1))];
        var audio = (new Audio(`/sfx/${effect}`))
        audio.volume = 1;
        audio.play();
    }
}

function saveSettings(save) {
    var settingsElements = Array.prototype.slice.call(document.getElementsByClassName("settingsInput"));
    settingsElements.forEach(settingElement => {
        if (settingElement.type == "checkbox") {
            console.log(settingElement.name, settingElement.checked);
            localStorage.setItem(`psv3_settings_${settingElement.name}`, settingElement.checked);
        } else {
            console.log(`Unknown type: ${settingElement.type}, not saving this data.`);
        }
    });
}

function update() {
    lastTimestamp = startTimestamp;
    startTimestamp = +Date.now();
    backgroundDegrees -= ((startTimestamp - lastTimestamp) / (80 + (Math.random() * 20)));
    backgroundDegrees %= 360;
    document.body.style.background = `linear-gradient(${backgroundDegrees}deg, rgba(4,1,18,1) 0%, rgb(17, 5, 44) 100%)`;
    requestAnimationFrame(update);
}

function getRandomSearch() {
    var searches = [
        "How to improve study habits",
        "Tips for better time management as a student",
        "How to stay motivated in school",
        "How to get good grades without stress",
        "How to improve focus while studying",
        "Best ways to prepare for exams",
        "How to manage school and extracurricular activities",
        "How to develop effective note-taking skills",
        "How to build self-discipline as a student",
        "How to overcome procrastination in school",
        "How to create a study schedule that works",
        "How to improve reading comprehension",
        "How to handle school stress and anxiety",
        "How to become a faster learner",
        "How to set academic goals effectively",
        "How to deal with academic pressure",
        "How to make the most of group study sessions",
        "How to stay organized for school assignments",
        "How to improve writing skills for essays and papers",
        "How to ask for help when struggling in school"
    ];
    var randomIndex = Math.floor(Math.random() * searches.length);
    return `https://www.google.com/search?q=${encodeURIComponent(searches[randomIndex])}`;
}

function openBlank() {
    const newWindow = window.open('about:blank', '_blank');
    newWindow.document.write(`
        <iframe src="${window.location.href}" 
                style="position: absolute; top: 0px; left: 0px; border: none; width: 100vw; height: 100vh;" 
                frameborder="0"></iframe>
    `);
    newWindow.document.close();

    window.location.href = getRandomSearch();
    close();
}

requestAnimationFrame(update);