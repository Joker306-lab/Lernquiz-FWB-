const params = new URLSearchParams(window.location.search);
const categoryKey = params.get("category") || "xabcde";
const categoryData = (window.QUIZ_QUESTION_BANK || {})[categoryKey];
const mode = localStorage.getItem("quizMode") || "learn";

if (!categoryData) {
  window.location.href = "quiz.html";
}

const TOTAL = categoryData.questions.length;
const allQuestions = categoryData.questions.map(q => ({ ...q }));
const retrySet = new Set();
let mainQueue = shuffle([...allQuestions]);
let retryQueue = [];
let currentQuestion = null;
let timer = 25;
let timerInterval = null;
let jokerConsumed = false;
let currentRemoved = false;
let answeredTotal = 0;
let mastered = new Set();
let attemptedWrong = new Set();
let score = 0;
let directCorrect = 0;
let repeatCorrect = 0;
let wrongCount = 0;
let timeoutCount = 0;

const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const progressLabel = document.getElementById("progressLabel");
const scoreValue = document.getElementById("scoreValue");
const directValue = document.getElementById("directValue");
const repeatValue = document.getElementById("repeatValue");
const wrongValue = document.getElementById("wrongValue");
const timeoutValue = document.getElementById("timeoutValue");
const jokerValue = document.getElementById("jokerValue");
const modePill = document.getElementById("modePill");
const categoryEyebrow = document.getElementById("categoryEyebrow");
const categoryTitle = document.getElementById("categoryTitle");
const highscoreValue = document.getElementById("highscoreValue");
const questionMeta = document.getElementById("questionMeta");
const questionText = document.getElementById("questionText");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const jokerBtn = document.getElementById("jokerBtn");

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function highscoreKey() {
  return `highscore_${categoryKey}_${mode}`;
}

function getHighscore() {
  return Number(localStorage.getItem(highscoreKey()) || "0");
}

function setHighscore(value) {
  const best = getHighscore();
  if (value > best) {
    localStorage.setItem(highscoreKey(), String(value));
  }
}

function updateStaticInfo() {
  categoryEyebrow.textContent = categoryData.title.toUpperCase();
  categoryTitle.textContent = categoryData.title;
  modePill.textContent = mode === "learn" ? "Lernmodus" : "Prüfungsmodus";
  highscoreValue.textContent = getHighscore();
  progressLabel.textContent = mode === "learn" ? "Richtig beantwortet" : "Beantwortet";
}

function updateStats() {
  scoreValue.textContent = score;
  directValue.textContent = directCorrect;
  repeatValue.textContent = repeatCorrect;
  wrongValue.textContent = wrongCount;
  timeoutValue.textContent = timeoutCount;
  jokerValue.textContent = jokerConsumed ? "verbraucht" : "1 verfügbar";

  const progressDone = mode === "learn" ? mastered.size : answeredTotal;
  progressText.textContent = `${progressDone} / ${TOTAL}`;
  progressFill.style.width = `${Math.min((progressDone / TOTAL) * 100, 100)}%`;
  highscoreValue.textContent = getHighscore();
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 25;
  timerEl.textContent = timer;
  timerInterval = setInterval(() => {
    timer -= 1;
    timerEl.textContent = timer;
    if (timer <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function getNextQuestion() {
  if (mainQueue.length > 0) {
    return mainQueue.shift();
  }

  if (mode === "learn" && retryQueue.length > 0) {
    mainQueue = shuffle([...retryQueue]);
    retryQueue = [];
    retrySet.clear();
    return mainQueue.shift();
  }

  return null;
}

function renderQuestion() {
  nextBtn.classList.add("hidden");
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  answersEl.innerHTML = "";
  currentRemoved = false;

  const next = getNextQuestion();
  if (!next) {
    finishQuiz();
    return;
  }

  currentQuestion = next;
  answeredTotal += 1;
  questionMeta.textContent = `Frage ${answeredTotal}`;
  questionText.textContent = currentQuestion.question;

  const shuffledAnswers = currentQuestion.answers.map((text, index) => ({ text, index }));
  for (let i = shuffledAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
  }

  shuffledAnswers.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.dataset.originalIndex = String(item.index);
    button.innerHTML = `
      <span class="answer-text">${item.text}</span>
      <img class="answer-image" src="assets/correct.png" alt="">
    `;
    button.addEventListener("click", () => handleAnswer(button, item.index));
    answersEl.appendChild(button);
  });

  setButtonsLocked(false);
  startTimer();
  updateStats();
}

function setButtonsLocked(locked) {
  document.querySelectorAll(".answer-btn").forEach(btn => {
    btn.disabled = locked;
    if (locked) btn.style.pointerEvents = "none";
  });
}

function showImageOnButton(button, type) {
  const image = button.querySelector(".answer-image");
  if (!image) return;
  image.src = type === "correct" ? "assets/correct.png" : "assets/wrong.png";
  button.classList.add("show-image");
}

function queueRetry(question) {
  if (mode !== "learn") return;
  if (mastered.has(question.id)) return;
  if (retrySet.has(question.id)) return;
  retrySet.add(question.id);
  retryQueue.push(question);
}

function handleAnswer(button, originalIndex) {
  clearInterval(timerInterval);
  setButtonsLocked(true);
  jokerBtn.disabled = true;

  const isCorrect = originalIndex === currentQuestion.correct;

  if (isCorrect) {
    button.classList.add("correct");
    showImageOnButton(button, "correct");
    playGlobalCorrectChime();

    if (attemptedWrong.has(currentQuestion.id)) {
      repeatCorrect += 1;
      score += 6;
    } else {
      directCorrect += 1;
      score += 10;
    }

    mastered.add(currentQuestion.id);
    feedbackEl.textContent = currentQuestion.explanation;
    feedbackEl.className = "feedback success";
  } else {
    button.classList.add("wrong");
    showImageOnButton(button, "wrong");
    playGlobalWrongTone();
    wrongCount += 1;
    attemptedWrong.add(currentQuestion.id);
    queueRetry(currentQuestion);
    feedbackEl.textContent = mode === "learn"
      ? "Nicht ganz. Diese Frage kommt später erneut."
      : "Nicht korrekt. Im Prüfungsmodus kommt jede Frage nur einmal.";
    feedbackEl.className = "feedback error";

    document.querySelectorAll(".answer-btn").forEach(btn => {
      if (Number(btn.dataset.originalIndex) === currentQuestion.correct) {
        btn.classList.add("correct");
      }
    });
  }

  updateStats();
  nextBtn.classList.remove("hidden");
}

function handleTimeout() {
  setButtonsLocked(true);
  jokerBtn.disabled = true;
  timeoutCount += 1;
  attemptedWrong.add(currentQuestion.id);
  queueRetry(currentQuestion);
  feedbackEl.textContent = mode === "learn"
    ? "Zeit abgelaufen. Diese Frage kommt später noch einmal."
    : "Zeit abgelaufen. Im Prüfungsmodus wird die Frage nicht wiederholt.";
  feedbackEl.className = "feedback error";
  updateStats();
  nextBtn.classList.remove("hidden");
}

function finishQuiz() {
  clearInterval(timerInterval);
  const percent = TOTAL > 0 ? Math.round((score / (TOTAL * 10)) * 100) : 0;
  let rating = "Noch Luft nach oben";
  if (percent >= 90) rating = "Sehr stark";
  else if (percent >= 75) rating = "Solide";

  setHighscore(score);

  const result = {
    categoryKey,
    categoryTitle: categoryData.title,
    mode,
    total: TOTAL,
    directCorrect,
    repeatCorrect,
    wrongCount,
    timeoutCount,
    jokerUsed: jokerConsumed ? 1 : 0,
    score,
    percent,
    rating,
    highscore: getHighscore()
  };

  sessionStorage.setItem("quizLastResult", JSON.stringify(result));
  window.location.href = "result.html";
}

jokerBtn.addEventListener("click", () => {
  if (jokerConsumed || !currentQuestion) return;

  const wrongButtons = [...document.querySelectorAll(".answer-btn")].filter(btn => {
    return Number(btn.dataset.originalIndex) !== currentQuestion.correct && !btn.classList.contains("removed");
  });

  if (wrongButtons.length === 0) return;

  const target = wrongButtons[Math.floor(Math.random() * wrongButtons.length)];
  target.classList.add("removed");
  target.disabled = true;
  jokerConsumed = true;
  score -= 2;
  if (score < 0) score = 0;
  jokerBtn.disabled = true;
  updateStats();
});

nextBtn.addEventListener("click", renderQuestion);

updateStaticInfo();
updateStats();
renderQuestion();
