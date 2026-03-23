const correctAudio = new Audio('assets/correct.mp3');
const wrongAudio = new Audio('assets/wrong.mp3');
correctAudio.preload = 'auto';
wrongAudio.preload = 'auto';
function playSound(type){
  try{
    if(type==='correct'){
      correctAudio.currentTime = 0;
      correctAudio.play();
    }else{
      wrongAudio.currentTime = 0;
      wrongAudio.play();
    }
  }catch(e){}
}
