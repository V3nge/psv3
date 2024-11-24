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

const allGamesList = document.getElementById("allGames");
const recentlyAddedCarousel = document.getElementById("recentlyAddedCarousel");

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

async function loadAllGames() {
  var listing;

  if (ToSearch == null) {
    listing = await (await fetch("/games")).json();
  } else {
    listing = await search(ToSearch);
  }

  console.log(listing);

  listing.forEach((item) => {
    if (item.name.toLowerCase().includes("game")) {
        item.name = applyLookalikes(item.name);
    }
  });

  if (ToSearch == null) {
    var built = listing
      .map(
        (game) =>
          `<div class="carousel-element centered"><a href='javascript:loadGame("/games/${game.slug}")'><img src="${game.thumbnail}" class="thumbnail" loading="lazy"></img><text>${game.name}</text></a></div>`
      )
      .join("");
    recentlyAddedCarousel.innerHTML = built;
  }

  listing = shuffleArray(listing);

  built = listing
    .map(
      (game) =>
        `<div class="game-icon centered"><a href='javascript:loadGame("/games/${game.slug}")'><img src="${game.thumbnail}" class="min-img"></img><text class="centerthing">${game.name}</text></a></div>`
    )
    .join("");
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
