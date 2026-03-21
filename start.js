const startBtn = document.getElementById("startBtn");
const sound = new Audio("assets/start.mp3");

startBtn.addEventListener("click", () => {
    sound.currentTime = 0;
    sound.play().catch(() => {});

    setTimeout(() => {
        window.location.href = "quiz.html";
    }, 500);
});
