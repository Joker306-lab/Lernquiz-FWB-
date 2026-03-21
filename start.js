document.getElementById("startBtn").addEventListener("click",async()=>{
const audio=new Audio("assets/start.mp3");
try{await audio.play()}catch(e){}
setTimeout(()=>{window.location="quiz.html"},500)
})
