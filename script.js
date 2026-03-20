function startQuiz() {
    window.location.href = "quiz.html";
}

document.addEventListener("mousemove", (e) => {
    const avatar = document.querySelector(".avatar");
    let x = (window.innerWidth / 2 - e.clientX) / 40;
    let y = (window.innerHeight / 2 - e.clientY) / 40;
    avatar.style.transform = `translate(${x}px, ${y}px)`;
});
