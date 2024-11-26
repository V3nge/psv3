const ios = () => {
    if (typeof window === `undefined` || typeof navigator === `undefined`) return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor || (window.opera && opera.toString() === `[object Opera]`));
};

const allGamesList = document.getElementById("allGames");
const recentlyAddedCarousel = document.getElementById("recentlyAddedCarousel");
const mostPlayedCarousel = document.getElementById("mostPlayCarousel");

var urlParams = new URLSearchParams(window.location.search);
var ToSearch = urlParams.get("search");

function searchThings() {
    var search = document.getElementById("search").value;
    if ("URLSearchParams" in window) {
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set("search", search);
        window.location.search = searchParams.toString();
    }
}

async function search(query) {
    return await (
        await fetch(`/search?search=${encodeURIComponent(query)}`)
    ).json();
}

function shuffleArray(arr) {
    // for (let i = arr.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [arr[i], arr[j]] = [arr[j], arr[i]];
    // }
    return arr;
}

const lookalikes = {
    a: ["\u0430", "\u00e0", "\u00e1", "\u1ea1", "\u0105"],
    c: ["\u0441", "\u0188", "\u010b"],
    d: ["\u0501", "\u0257"],
    e: ["\u0435", "\u1eb9", "\u0117", "\u0117", "\u00e9", "\u00e8"],
    g: ["\u0121"],
    h: ["\u04bb"],
    i: ["\u0456", "\u00ed", "\u00ec", "\u00ef"],
    j: ["\u0458", "\u029d"],
    k: ["\u03ba"],
    l: ["\u04cf", "\u1e37"],
    n: ["\u0578"],
    o: [
        "\u043e",
        "\u03bf",
        "\u0585",
        "\u022f",
        "\u1ecd",
        "\u1ecf",
        "\u01a1",
        "\u00f6",
        "\u00f3",
        "\u00f2",
    ],
    p: ["\u0440"],
    q: ["\u0566"],
    s: ["\u0282"],
    u: ["\u03c5", "\u057d", "\u00fc", "\u00fa", "\u00f9"],
    v: ["\u03bd", "\u0475"],
    x: ["\u0445", "\u04b3"],
    y: ["\u0443", "\u00fd"],
    z: ["\u0290", "\u017c"],
};

function applyLookalikes(inputString) {
    return inputString
        .split("")
        .map((char) => {
            const lowerChar = char.toLowerCase();
            if (lookalikes[lowerChar]) {
                return lookalikes[lowerChar][
                    Math.floor(Math.random() * lookalikes[lowerChar].length)
                ];
            }
            return char; // Keep the original character if no look-alike
        })
        .join("");
}

async function fetchAndSortGames() {
    try {
        const response = await fetch('/stats');
        if (!response.ok) {
            throw new Error(`Error fetching stats: ${response.statusText}`);
        }
        const gameData = await response.json();
        function calculateAndSortScores(gameData) {
            const gameEntries = Object.entries(gameData);
            const scoredGames = gameEntries.map(([game, stats]) => {
                const score = (stats.recurring / stats.starts || 0) + (stats.recurring * 2);
                return { game, score, starts: stats.starts, recurring: stats.recurring };
            });

            scoredGames.sort((a, b) => b.score - a.score);
            return scoredGames;
        }
        const sortedGames = calculateAndSortScores(gameData);
        console.log(sortedGames);
        return sortedGames;
    } catch (error) {
        console.error('Error:', error);
    }
}

function orderGames(gamesList, scoresList) {
    // Ensure both inputs are valid arrays
    if (!Array.isArray(gamesList) || !Array.isArray(scoresList)) {
        throw new TypeError("Both arguments must be arrays");
    }

    const scoresMap = scoresList.reduce((acc, item) => {
        if (item.game && typeof item.game === 'string') {
            const slug = item.game.split('/games/')[1]?.split('/')[0];
            if (slug) acc[slug] = item;
        }
        return acc;
    }, {});

    return gamesList.sort((a, b) => {
        const indexA = scoresList.findIndex(item =>
            item.game.includes(`/games/${a.slug}/`)
        );
        const indexB = scoresList.findIndex(item =>
            item.game.includes(`/games/${b.slug}/`)
        );

        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });
}

async function loadAllGames() {
    let listing;
    var suffix = "";

    if(ios()) {
        suffix = "index.html";
    }

    if (ToSearch == null) {
        listing = await (await fetch("/games")).json();
    } else {
        listing = await search(ToSearch);
    }

    console.log(listing);

    listing.forEach((item) => {
        item.name = item.name.replaceAll("a", "а").replaceAll("e", "е");
    });

    if (ToSearch == null) {
        const built = listing.reverse()
            .map(
                (game) =>
                `<div class="carousel-element centered">
                    <a href='javascript:openBlank("/games/${game.slug}/${suffix}")'>
                        <img src="${game.thumbnail}" class="thumbnail" loading="lazy" />
                        <text class="centerthing">${game.name}</text>
                    </a>
                </div>`
            )
            .join("");
        recentlyAddedCarousel.innerHTML = built;
    }

    listing = listing.reverse();

    const allGamesBuilt = listing
        .map(
            (game) =>
            `<div class="game-icon centered">
                <a href='javascript:openBlank("/games/${game.slug}/${suffix}")'>
                    <img src="${game.thumbnail}" class="min-img" />
                    <text class="centerthing">${game.name}</text>
                </a>
            </div>`
        )
        .join("");
    allGamesList.innerHTML = allGamesBuilt;

    const popular = await fetchAndSortGames();
    const popularListing = orderGames(listing, popular);

    const popularBuilt = popularListing.map(
        (game) =>
        `<div class="carousel-element centered">
            <a href='javascript:openBlank("/games/${game.slug}/")'>
                <img src="${game.thumbnail}" class="thumbnail" loading="lazy" />
                <text class="centerthing">${game.name}</text>
            </a>
        </div>`
    )
    .join("");
    mostPlayedCarousel.innerHTML = popularBuilt;
}

function openBlank(url) {
    const newWindow = window.open('about:blank', '_blank');
    newWindow.document.write(`
        <iframe src="${url}" 
                style="position: absolute; top: 0px; left: 0px; border: none; width: 100vw; height: 100vh;" 
                frameborder="0"></iframe>
    `);
    newWindow.document.close();
}

function loadGame(source) {
    document.body.style.overflow = "hidden";
    inGame = true;
    scrollTo(0, 0);

    if (gameIframe != null) {
        gameIframe.remove();
    }

    gameIframe = document.createElement("iframe");
    gameIframe.src = source;
    document.body.appendChild(gameIframe);
    history.replaceState({}, "", source);
    gameIframe.contentWindow.focus();
}

loadAllGames();