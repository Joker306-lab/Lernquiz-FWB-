document.getElementById("startBtn").onclick=()=>{
const audio=new Audio("assets/start.mp3");
audio.play().catch(()=>{});
setTimeout(()=>window.location="quiz.html",400);
}