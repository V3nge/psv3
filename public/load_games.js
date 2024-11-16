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

async function search(query) {
    return (await (await fetch(`/search?search=${encodeURIComponent(query)}`)).json());
}

async function loadAllGames() {
    var listing;

    if(ToSearch == null) {
        listing = (await (await fetch("/games")).json());
    } else {
        listing = await search(ToSearch);
    }

    console.log(listing);

    listing = listing.map(value => {
        return {image: `/images/games/${value.split('"')[0].replaceAll("/", "")}`, gameName: decodeURIComponent(value.split('"')[0]).replaceAll("/", ""), opens: `/games/${value.split('"')[0]}`};
    });

    var games = [];

    listing.forEach(item => {
        var game = {
            src: item.image, 
            text: item.gameName,
            opens: item.opens
        };

        games.push(game);
    });

    if(ToSearch == null) {
        var built = games.map(game => `<div class="carousel-element centered"><a href='javascript:loadGame("${game.opens}")'><img src="${game.src}" class="thumbnail" loading="lazy"></img><text>${game.text}</text></a></div>`).join('');
        recentlyAddedCarousel.innerHTML = built;    
    }

    if(ToSearch != null) {
        built = games.map(game => `<div class="game-icon centered"><a href='javascript:loadGame("${game.opens}")'><img src="${game.src}" class="min-img"></img></a></div>`).join('');
        allGamesList.innerHTML = built;
    }
}

function loadGame(source) {
    document.body.style.overflow = "hidden";
    inGame = true;
    scrollTo(0, 0);
    
    if(gameIframe != null) { 
        gameIframe.remove(); 
    }

    gameIframe = document.createElement("iframe");
    gameIframe.src = source;
    document.body.appendChild(gameIframe);
    history.pushState({}, "", source);
    gameIframe.contentWindow.focus();
}

loadAllGames();