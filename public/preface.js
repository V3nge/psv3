function querySetting(name) {
    var setting = localStorage.getItem(`psv3_settings_${name}`);
    if (setting == null) {
        return null;
    }
    return JSON.parse(setting);
}

(async function() {
    if (querySetting("a_tags")) {
        var allGames = document.getElementById("allGames");
        allGames.classList = [];
        allGames.innerHTML = await (await fetch("/games-a-tags")).text();
    }
})();