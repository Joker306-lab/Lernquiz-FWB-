function startQuiz() {
  window.location.href = "quiz.html";
}

const startButton = document.getElementById("startButton");
if (startButton) {
  startButton.addEventListener("click", startQuiz);
}

const avatarStage = document.getElementById("avatarStage");

function moveAvatar(clientX, clientY) {
  if (!avatarStage) return;
  const offsetX = (window.innerWidth / 2 - clientX) / 65;
  const offsetY = (window.innerHeight / 2 - clientY) / 85;
  avatarStage.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

document.addEventListener("mousemove", (event) => {
  moveAvatar(event.clientX, event.clientY);
}, { passive: true });

document.addEventListener("touchmove", (event) => {
  const touch = event.touches && event.touches[0];
  if (!touch) return;
  moveAvatar(touch.clientX, touch.clientY);
}, { passive: true });

document.addEventListener("touchend", () => {
  if (!avatarStage) return;
  avatarStage.style.transform = "translate(0px, 0px)";
}, { passive: true });
