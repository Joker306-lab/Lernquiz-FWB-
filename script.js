const quizData = [
  {
    category: "xABCDE",
    questions: [
      {
        question: "Was ist der erste Schritt im xABCDE Schema?",
        answers: ["Airway", "Breathing", "Circulation", "Disability"],
        correct: 0
      }
    ]
  }
];

let currentCategory = 0;
let currentQuestion = 0;

function loadQuestion() {
  const cat = quizData[currentCategory];
  const q = cat.questions[currentQuestion];

  document.getElementById("category").innerText = cat.category;
  document.getElementById("question").innerText = q.question;

  const img = document.getElementById("image");
  if (q.type === "image") {
    img.src = q.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.answers.forEach((a, i) => {
    const btn = document.createElement("button");
    btn.innerText = a;
    btn.onclick = () => checkAnswer(i);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(i) {
  const q = quizData[currentCategory].questions[currentQuestion];

  if (i === q.correct) {
    alert("Richtig");
  } else {
    alert("Falsch");
  }

  currentQuestion++;
  if (currentQuestion >= quizData[currentCategory].questions.length) {
    currentCategory++;
    currentQuestion = 0;
  }

  if (currentCategory < quizData.length) {
    loadQuestion();
  } else {
    alert("Fertig!");
  }
}

loadQuestion();
