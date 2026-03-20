function startQuiz() {
  window.location.href = "quiz.html";
}

const startButton = document.getElementById("startButton");
if (startButton) {
  startButton.addEventListener("click", startQuiz);
}

const avatarWrap = document.getElementById("avatarWrap");

function moveAvatar(clientX, clientY) {
  if (!avatarWrap) return;
  const x = (window.innerWidth / 2 - clientX) / 55;
  const y = (window.innerHeight / 2 - clientY) / 70;
  avatarWrap.style.transform = `translate(${x}px, ${y}px)`;
}

document.addEventListener("mousemove", (e) => {
  moveAvatar(e.clientX, e.clientY);
}, { passive: true });

document.addEventListener("touchmove", (e) => {
  const t = e.touches && e.touches[0];
  if (!t) return;
  moveAvatar(t.clientX, t.clientY);
}, { passive: true });

document.addEventListener("touchend", () => {
  if (!avatarWrap) return;
  avatarWrap.style.transform = "translate(0px, 0px)";
}, { passive: true });
