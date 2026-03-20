const questions=[{
q:"Was bedeutet das C im xABCDE Schema?",
answers:["Control","Core","Circulation","Cardio"],
correct:2
}];

let current=0;
let correctCount=0;
let timer=25;
let interval;
let jokerUsed=false;
let wrongQueue=[];

const answersEl=document.getElementById("answers");
const timerEl=document.getElementById("timer");
const progress=document.getElementById("progressBar");

const correctSound=new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
const wrongSound=new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

function loadQuestion(){
answersEl.innerHTML="";
let q=questions[current];

q.answers.forEach((a,i)=>{
let div=document.createElement("div");
div.className="answer";
div.innerText=a;

div.onclick=()=>selectAnswer(div,i);

answersEl.appendChild(div);
});

timer=25;
timerEl.innerText=timer;
clearInterval(interval);
interval=setInterval(()=>{
timer--;
timerEl.innerText=timer;
if(timer<=0){
clearInterval(interval);
wrongQueue.push(q);
nextQuestion();
}
},1000);
}

function selectAnswer(el,index){
clearInterval(interval);
let q=questions[current];

if(index===q.correct){
el.classList.add("correct");
correctSound.play();
showImage(el,"assets/correct.png");
correctCount++;
progress.style.width=(correctCount/100*100)+"%";
}else{
el.classList.add("wrong");
wrongSound.play();
showImage(el,"assets/wrong.png");
wrongQueue.push(q);
}

setTimeout(nextQuestion,1500);
}

function showImage(el,src){
let img=document.createElement("img");
img.src=src;
el.appendChild(img);
}

function nextQuestion(){
if(wrongQueue.length>0){
questions.push(wrongQueue.shift());
}
current++;
if(current>=questions.length){
current=0;
}
jokerUsed=false;
loadQuestion();
}

document.getElementById("jokerBtn").onclick=()=>{
if(jokerUsed) return;
jokerUsed=true;

let q=questions[current];
let wrongs=q.answers.map((a,i)=>i).filter(i=>i!==q.correct);
let remove=wrongs[Math.floor(Math.random()*wrongs.length)];

answersEl.children[remove].style.display="none";
};

loadQuestion();
