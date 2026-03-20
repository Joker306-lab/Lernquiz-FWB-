function startQuiz(){
window.location.href="quiz.html";
}

document.getElementById("startButton").addEventListener("click",startQuiz);

const avatarStage=document.getElementById("avatarStage");

function move(x,y){
const dx=(window.innerWidth/2-x)/70;
const dy=(window.innerHeight/2-y)/90;
avatarStage.style.transform=`translate(${dx}px,${dy}px)`;
}

document.addEventListener("mousemove",e=>move(e.clientX,e.clientY));
document.addEventListener("touchmove",e=>{
const t=e.touches[0];
if(t)move(t.clientX,t.clientY);
},{passive:true});

document.addEventListener("touchend",()=>{
avatarStage.style.transform="translate(0,0)";
});
