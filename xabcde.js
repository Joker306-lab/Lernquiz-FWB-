let queue = [...questions];
let currentQuestion = null;
let timer = 25;
let timerInterval = null;
let jokerUsed = false;
let correctCount = Number(localStorage.getItem("xabcdeCorrectCount") || "0");
let answeredCount = 0;

const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progressFill");
const currentCountEl = document.getElementById("currentCount");
const jokerBtn = document.getElementById("jokerBtn");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const questionTextEl = document.getElementById("questionText");
const questionMetaEl = document.getElementById("questionMeta");

function saveProgress() {
  localStorage.setItem("xabcdeCorrectCount", String(correctCount));
}

function updateProgress() {
  currentCountEl.textContent = String(correctCount);
  const width = Math.min((correctCount / 100) * 100, 100);
  progressFill.style.width = `${width}%`;
}

function shuffleAnswers(question) {
  const mapped = question.answers.map((text, index) => ({ text, index }));
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
  }
  return mapped;
}

function setButtonsLocked(locked) {
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach(btn => {
    btn.disabled = locked;
    if (locked) btn.style.pointerEvents = "none";
  });
}

function resetJoker() {
  jokerUsed = false;
  jokerBtn.disabled = false;
}

function renderQuestion() {
  if (queue.length === 0) {
    queue = [...questions];
  }

  resetJoker();
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.classList.add("hidden");
  answersEl.innerHTML = "";

  currentQuestion = queue.shift();
  answeredCount += 1;
  questionMetaEl.textContent = `Frage ${answeredCount}`;
  questionTextEl.textContent = currentQuestion.question;

  const shuffled = shuffleAnswers(currentQuestion);

  shuffled.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.dataset.originalIndex = String(item.index);

    const text = document.createElement("span");
    text.className = "answer-text";
    text.textContent = item.text;

    const image = document.createElement("img");
    image.className = "answer-image";
    image.alt = "";
    image.src = "assets/correct.png";

    button.appendChild(text);
    button.appendChild(image);
    button.addEventListener("click", () => handleAnswer(button, item.index));

    answersEl.appendChild(button);
  });

  currentQuestion.shuffled = shuffled;
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 25;
  timerEl.textContent = String(timer);

  timerInterval = setInterval(() => {
    timer -= 1;
    timerEl.textContent = String(timer);

    if (timer <= 0) {
      clearInterval(timerInterval);
      feedbackEl.textContent = "Zeit abgelaufen. Die Frage kommt später noch einmal.";
      feedbackEl.className = "feedback error";
      queue.push(currentQuestion);
      setButtonsLocked(true);
      jokerBtn.disabled = true;
      nextBtn.classList.remove("hidden");
    }
  }, 1000);
}

function showImageOnButton(button, type) {
  const image = button.querySelector(".answer-image");
  if (!image) return;
  image.src = type === "correct" ? "assets/correct.png" : "assets/wrong.png";
  button.classList.add("show-image");
}

function handleAnswer(button, originalIndex) {
  clearInterval(timerInterval);
  setButtonsLocked(true);
  jokerBtn.disabled = true;

  const isCorrect = originalIndex === currentQuestion.correct;

  if (isCorrect) {
    button.classList.add("correct");
    showImageOnButton(button, "correct");
    if (typeof playGlobalCorrectChime === "function") playGlobalCorrectChime();
    correctCount += 1;
    saveProgress();
    updateProgress();
    feedbackEl.textContent = currentQuestion.explanation;
    feedbackEl.className = "feedback success";
  } else {
    button.classList.add("wrong");
    showImageOnButton(button, "wrong");
    if (typeof playGlobalWrongTone === "function") playGlobalWrongTone();
    feedbackEl.textContent = "Nicht ganz. Diese Frage kommt später erneut.";
    feedbackEl.className = "feedback error";
    queue.push(currentQuestion);

    const buttons = Array.from(document.querySelectorAll(".answer-btn"));
    buttons.forEach((btn) => {
      const idx = Number(btn.dataset.originalIndex);
      if (idx === currentQuestion.correct) {
        btn.classList.add("correct");
      }
    });
  }

  nextBtn.classList.remove("hidden");
}

jokerBtn.addEventListener("click", () => {
  if (jokerUsed || !currentQuestion) return;

  const buttons = Array.from(document.querySelectorAll(".answer-btn"));
  const wrongButtons = buttons.filter((btn) => {
    const idx = Number(btn.dataset.originalIndex);
    return idx !== currentQuestion.correct && !btn.classList.contains("removed");
  });

  if (wrongButtons.length === 0) return;

  const randomButton = wrongButtons[Math.floor(Math.random() * wrongButtons.length)];
  randomButton.classList.add("removed");
  randomButton.disabled = true;
  jokerUsed = true;
  jokerBtn.disabled = true;
});

nextBtn.addEventListener("click", renderQuestion);

updateProgress();
renderQuestion();
