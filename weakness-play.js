const paramsW=new URLSearchParams(window.location.search);
const categoryKeyW=paramsW.get("category")||"xabcde";
function loadWeaknesses(){try{return JSON.parse(localStorage.getItem("quizWeaknesses")||"{}");}catch(e){return {};}}
function saveWeaknesses(data){localStorage.setItem("quizWeaknesses",JSON.stringify(data));}
const bankW=(window.QUIZ_QUESTION_BANK||{})[categoryKeyW];
if(!bankW){window.location.href="weaknesses.html";}
let weakData=loadWeaknesses();
let ids=(weakData[categoryKeyW]||[]);
let queue=(bankW.questions||[]).filter(q=>ids.includes(q.id));
if(queue.length===0){window.location.href="weaknesses.html";}
let current=null,timer=25,timerInterval=null,jokerUsed=false,learned=0,wrong=0,timeouts=0,index=0;
const timerElW=document.getElementById("timer"),
progressFillW=document.getElementById("progressFill"),
progressTextW=document.getElementById("progressText"),
scoreValueW=document.getElementById("scoreValue"),
directValueW=document.getElementById("directValue"),
repeatValueW=document.getElementById("repeatValue"),
wrongValueW=document.getElementById("wrongValue"),
timeoutValueW=document.getElementById("timeoutValue"),
jokerValueW=document.getElementById("jokerValue"),
highscoreValueW=document.getElementById("highscoreValue"),
categoryEyebrowW=document.getElementById("categoryEyebrow"),
categoryTitleW=document.getElementById("categoryTitle"),
questionMetaW=document.getElementById("questionMeta"),
questionTextW=document.getElementById("questionText"),
questionMediaW=document.getElementById("questionMedia"),
questionImageW=document.getElementById("questionImage"),
questionImageFallbackW=document.getElementById("questionImageFallback"),
answersElW=document.getElementById("answers"),
feedbackElW=document.getElementById("feedback"),
nextBtnW=document.getElementById("nextBtn"),
jokerBtnW=document.getElementById("jokerBtn");
categoryEyebrowW.textContent="MEINE SCHWÄCHEN";
categoryTitleW.textContent=bankW.title;
function syncStats(){
  scoreValueW.textContent=learned;
  directValueW.textContent=wrong;
  repeatValueW.textContent=timeouts;
  wrongValueW.textContent=queue.length;
  timeoutValueW.textContent=timer;
  jokerValueW.textContent=jokerUsed?"genutzt":"verfügbar";
  progressTextW.textContent=`${learned} / ${learned+queue.length}`;
  progressFillW.style.width=`${(learned/(learned+queue.length||1))*100}%`;
  highscoreValueW.textContent=queue.length;
}
function setButtonsLockedW(locked){document.querySelectorAll(".answer-btn").forEach(btn=>{btn.disabled=locked;if(locked)btn.style.pointerEvents="none";});}
function showImage(button,type){const image=button.querySelector(".answer-image");if(!image)return;image.src=type==="correct"?"assets/correct.png":"assets/wrong.png";button.classList.add("show-image");}
function startTimerW(){clearInterval(timerInterval);timer=25;timerElW.textContent=timer;syncStats();timerInterval=setInterval(()=>{timer-=1;timerElW.textContent=timer;syncStats();if(timer<=0){clearInterval(timerInterval);handleTimeoutW();}},1000);}
function removeCurrentWeak(){weakData=loadWeaknesses();const arr=weakData[categoryKeyW]||[];weakData[categoryKeyW]=arr.filter(id=>id!==current.id);saveWeaknesses(weakData);queue=queue.filter(q=>q.id!==current.id);}
function hideQuestionMediaW(){
  if(questionMediaW)questionMediaW.classList.add("hidden");
  if(questionImageW){questionImageW.classList.add("hidden");questionImageW.removeAttribute("src");questionImageW.alt="";}
  if(questionImageFallbackW)questionImageFallbackW.classList.add("hidden");
}
function showQuestionMediaW(question){
  if(!questionMediaW||!questionImageW||!question.image){hideQuestionMediaW();return;}
  questionMediaW.classList.remove("hidden");
  questionImageFallbackW.classList.add("hidden");
  questionImageW.classList.remove("hidden");
  questionImageW.alt=question.imageAlt||"EKG-Beispielfrage";
  questionImageW.onerror=()=>{questionImageW.classList.add("hidden");questionImageFallbackW.classList.remove("hidden");};
  questionImageW.onload=()=>{questionImageW.classList.remove("hidden");questionImageFallbackW.classList.add("hidden");};
  questionImageW.src=question.image;
}
function renderW(){
  nextBtnW.classList.add("hidden");
  feedbackElW.textContent="";
  feedbackElW.className="feedback";
  answersElW.innerHTML="";
  jokerUsed=false;
  jokerBtnW.disabled=false;
  if(queue.length===0){
    hideQuestionMediaW();
    feedbackElW.textContent="Stark. Deine Schwächenliste ist leer.";
    feedbackElW.className="feedback success";
    questionMetaW.textContent="Fertig";
    questionTextW.textContent="Alle markierten Schwächen wurden bereinigt.";
    jokerBtnW.disabled=true;
    syncStats();
    return;
  }
  current=queue[0];
  index+=1;
  questionMetaW.textContent=`Schwäche ${index}`;
  questionTextW.textContent=current.question;
  showQuestionMediaW(current);
  const shuffled=current.answers.map((text,index)=>({text,index}));
  for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
  shuffled.forEach(item=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="answer-btn";
    button.dataset.originalIndex=String(item.index);
    button.innerHTML=`<span class="answer-text">${item.text}</span><img class="answer-image" src="assets/correct.png" alt="">`;
    button.addEventListener("click",()=>handleAnswerW(button,item.index));
    answersElW.appendChild(button);
  });
  setButtonsLockedW(false);
  startTimerW();
  syncStats();
}
function handleAnswerW(button,originalIndex){
  clearInterval(timerInterval);
  setButtonsLockedW(true);
  jokerBtnW.disabled=true;
  const isCorrect=originalIndex===current.correct;
  if(isCorrect){
    button.classList.add("correct");
    showImage(button,"correct");
    playSound("correct");
    learned+=1;
    removeCurrentWeak();
    feedbackElW.textContent=current.explanation;
    feedbackElW.className="feedback success";
  }else{
    button.classList.add("wrong");
    showImage(button,"wrong");
    playSound("wrong");
    wrong+=1;
    queue.push(queue.shift());
    feedbackElW.textContent="Noch nicht sicher. Diese Frage bleibt in deiner Schwächenliste.";
    feedbackElW.className="feedback error";
    document.querySelectorAll(".answer-btn").forEach(btn=>{if(Number(btn.dataset.originalIndex)===current.correct){btn.classList.add("correct");showImage(btn,"correct");}});
  }
  syncStats();
  nextBtnW.classList.remove("hidden");
}
function handleTimeoutW(){
  setButtonsLockedW(true);
  jokerBtnW.disabled=true;
  timeouts+=1;
  queue.push(queue.shift());
  playSound("wrong");
  feedbackElW.textContent="Zeit abgelaufen. Die Frage bleibt in deiner Schwächenliste.";
  feedbackElW.className="feedback error";
  syncStats();
  nextBtnW.classList.remove("hidden");
}
jokerBtnW.addEventListener("click",()=>{
  if(jokerUsed||!current)return;
  const wrongButtons=[...document.querySelectorAll(".answer-btn")].filter(btn=>Number(btn.dataset.originalIndex)!==current.correct&&!btn.classList.contains("removed"));
  if(wrongButtons.length===0)return;
  const target=wrongButtons[Math.floor(Math.random()*wrongButtons.length)];
  target.classList.add("removed");
  target.disabled=true;
  jokerUsed=true;
  jokerBtnW.disabled=true;
  syncStats();
});
nextBtnW.addEventListener("click",renderW);
hideQuestionMediaW();
renderW();
