const follower = document.querySelector('.follower');

// Variables for current position and target position
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

// Listen for mouse movement
document.addEventListener('mousemove', (e) => {
    targetX = e.pageX;
    targetY = e.pageY;
});

// Smooth animation loop
function animate() {
    // Update the current position with smooth easing
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    // Apply the new position to the follower
    follower.style.transform = `translate(${currentX}px, ${currentY}px)`;

    requestAnimationFrame(animate); // Continue the animation
}

// Start the animation
animate();