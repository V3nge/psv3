const follower = document.querySelector('.follower');

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = e.x;
    targetY = e.y;
});

function animate() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    follower.style.transform = `translate(${currentX}px, ${currentY}px)`;

    requestAnimationFrame(animate);
}

animate();