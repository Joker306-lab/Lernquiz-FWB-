const q={answers:["Control","Core","Circulation","Cardio"],correct:2}
const answersDiv=document.getElementById("answers")
const feedback=document.getElementById("feedback")

q.answers.forEach((a,i)=>{
const btn=document.createElement("button")
btn.className="answer"
btn.textContent=a
btn.onclick=()=>{
if(i===q.correct){
btn.classList.add("correct")
feedback.textContent="Richtig"
playCorrect()
}else{
btn.classList.add("wrong")
feedback.textContent="Falsch"
}
}
answersDiv.appendChild(btn)
})

function playCorrect(){
try{
const ctx=new (window.AudioContext||window.webkitAudioContext)()
const o=ctx.createOscillator()
o.frequency.value=600
o.connect(ctx.destination)
o.start()
o.stop(ctx.currentTime+0.2)
}catch(e){}
}
