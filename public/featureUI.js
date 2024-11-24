var newDesc = document.getElementById("newDescriptor");
var oldDesc = document.getElementById("oldDescriptor");
var descriptors = [
  "The Unmatched Game Library",
  "Speed and Performance",
  "Unstoppable Access",
  "The Responsive Design",
  "Always Evolving",
  "The Innovative Experience",
  "User-Focused",
];
var index = 0;

newDesc.style.opacity = 0;
oldDesc.style.opacity = 0;

function fadeDescriptors() {
  newDesc.style.opacity = 0;
  oldDesc.style.opacity = 1;

  setTimeout(() => {
    index = (index + 1) % descriptors.length;
    oldDesc.textContent = descriptors[index];
    newDesc.textContent = descriptors[(index + 1) % descriptors.length];
    newDesc.style.opacity = 1;
    oldDesc.style.opacity = 0;
  }, 1500);
}

function randomCapitalize(str) {
  return str
    .split("")
    .map((char) =>
      Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase()
    )
    .join("");
}

setInterval(fadeDescriptors, 3000);
setInterval(function () {
    oldDesc.textContent = randomCapitalize(oldDesc.textContent);
    newDesc.textContent = randomCapitalize(newDesc.textContent);
}, 300);
