// function iOS() {
//     return [
//       'iPad Simulator',
//       'iPhone Simulator',
//       'iPod Simulator',
//       'iPad',
//       'iPhone',
//       'iPod'
//     ].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
// }

const allGamesList = document.getElementById('allGames');
const recentlyAddedCarousel = document.getElementById('recentlyAddedCarousel');

var urlParams = new URLSearchParams(window.location.search);
var ToSearch = urlParams.get('search');

function searchThings() {
    var search = document.getElementById("search").value;
    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set("search", search);
        window.location.search = searchParams.toString();
    }    
}

async function search(query) {
    return (await (await fetch(`/search?search=${encodeURIComponent(query)}`)).json());
}

function shuffleArray(arr) {
    // for (let i = arr.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [arr[i], arr[j]] = [arr[j], arr[i]];
    // }
    return arr;
}

async function loadAllGames() {
    var listing;

    if (ToSearch == null) {
        listing = (await (await fetch("/games")).json());
    } else {
        listing = await search(ToSearch);
    }

    console.log(listing);

    if (ToSearch == null) {
        var built = listing.map(game => `<div class="carousel-element centered"><a href='javascript:loadGame("/games/${game.slug}")'><img src="${game.thumbnail}" class="thumbnail" loading="lazy"></img><text>${game.name}</text></a></div>`).join('');
        recentlyAddedCarousel.innerHTML = built;
    }

    listing = shuffleArray(listing);

    built = listing.map(game => `<div class="game-icon centered"><a href='javascript:loadGame("/games/${game.slug}")'><img src="${game.thumbnail}" class="min-img"></img><text class="centerthing glowing-border">${game.name}</text></a></div>`).join('');
    allGamesList.innerHTML = built;
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
    history.pushState({}, "", source);
    gameIframe.contentWindow.focus();
}

loadAllGames();