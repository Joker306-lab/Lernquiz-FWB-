const startButton = document.getElementById('startButton');
const avatarStage = document.getElementById('avatarStage');
const startSound = new Audio('assets/start.mp3');

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

startButton.addEventListener('click', async () => {
  let played = false;
  try {
    startSound.currentTime = 0;
    await startSound.play();
    played = true;
  } catch (error) {
    played = false;
  }

  setTimeout(() => {
    window.location.href = 'quiz.html';
  }, played ? 700 : 120);
});
