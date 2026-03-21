function startQuiz(){window.location.href='quiz.html';}
document.getElementById('startButton').addEventListener('click',startQuiz);
const avatarStage=document.getElementById('avatarStage');
function moveAvatar(x,y){
  const dx=(window.innerWidth/2-x)/70;
  const dy=(window.innerHeight/2-y)/90;
  avatarStage.style.transform=`translate(${dx}px,${dy}px)`;
}
document.addEventListener('mousemove',e=>moveAvatar(e.clientX,e.clientY),{passive:true});
document.addEventListener('touchmove',e=>{
  const t=e.touches&&e.touches[0];
  if(!t)return;
  moveAvatar(t.clientX,t.clientY);
},{passive:true});
document.addEventListener('touchend',()=>avatarStage.style.transform='translate(0,0)',{passive:true});
const startSound = new Audio("assets/dein-sound.mp3");

document.getElementById('startButton').addEventListener('click', () => {
  startSound.play();
  setTimeout(() => {
    window.location.href = "quiz.html";
  }, 300); // kleiner Delay für nicer Effekt
});
