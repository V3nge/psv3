var defender_guy = document.getElementById("defender-guy");

var bullets = [];
var enemies = [];
var charge  = 0;
var mouse_down = false;
var currentBullet = null;

window.onmousemove = function(e) {
    defender_guy.style.left = e.clientX;
    if(currentBullet != null) {
        currentBullet.style.left = e.clientX;
    }
};

window.onmousedown = function(e) {
    mouse_down = true;
    currentBullet = document.createElement("div");
    currentBullet.classList = ["bullet"];
    currentBullet.style.left = e.clientX;
    document.body.appendChild(currentBullet);
}

window.onmouseup = function() {
    mouse_down = false;
    charge = 0;
}

function update() {
    if(mouse_down) {
        charge++;
        currentBullet.style.width = charge;
        currentBullet.style.height = charge;
    } else {
        if(currentBullet != null) {
            bullets.push({object:currentBullet,progress:0});
            currentBullet = null;
        }
    }

    bullets.forEach(ibullet => {
        ibullet.progress++;
        ibullet.object.style.bottom = `${ibullet.progress}px`;
    });

    requestAnimationFrame(update);
}

requestAnimationFrame(update);

setInterval(function() {
    var evil = document.createElement("img");
    evil.src = "3kh0.png";
    evil.classList = ["evil"];
    evil.style.left = `${Math.random()*90}%`;
    enemies.push(evil);
    document.body.appendChild(evil);
}, 1000)