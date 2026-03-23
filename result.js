const raw=sessionStorage.getItem("quizLastResult");
if(!raw){window.location.href="quiz.html";}
const data=JSON.parse(raw);
document.getElementById("resultTitle").textContent=`${data.categoryTitle} abgeschlossen`;
document.getElementById("resultSummary").textContent=`${data.mode==="learn"?"Lernmodus":"Prüfungsmodus"} · ${data.rating}`;
document.getElementById("scoreValue").textContent=data.score;
document.getElementById("percentValue").textContent=`${data.percent}%`;
document.getElementById("highscoreValue").textContent=data.highscore;
document.getElementById("totalValue").textContent=data.total;
document.getElementById("directValue").textContent=data.directCorrect;
document.getElementById("repeatValue").textContent=data.repeatCorrect;
document.getElementById("wrongValue").textContent=data.wrongCount;
document.getElementById("timeoutValue").textContent=data.timeoutCount;
document.getElementById("jokerValue").textContent=data.jokerUsed;
document.getElementById("ratingBox").textContent=data.rating;
document.getElementById("replayButton").href=`play.html?category=${data.categoryKey}`;
