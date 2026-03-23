const startButton = document.getElementById('startButton');
const avatarStage = document.getElementById('avatarStage');
const bgAudio = { play: async()=>{}, pause: ()=>{}, currentTime:0 };

function moveAvatar(x, y) {
  const dx = (window.innerWidth / 2 - x) / 70;
  const dy = (window.innerHeight / 2 - y) / 90;
  avatarStage.style.transform = `translate(${dx}px, ${dy}px)`;
}
document.addEventListener('mousemove', e => moveAvatar(e.clientX, e.clientY), { passive: true });
document.addEventListener('touchmove', e => {
  const t = e.touches && e.touches[0];
  if (!t) return;
  moveAvatar(t.clientX, t.clientY);
}, { passive: true });
document.addEventListener('touchend', () => { avatarStage.style.transform = 'translate(0,0)'; }, { passive: true });

async function startBackgroundAudio() {
  try {
    bgAudio.currentTime = 0;
    await bgAudio.play();
  } catch (e) {
    // Browser blocked autoplay. We leave it quiet rather than annoying the user.
  }
}

document.addEventListener('DOMContentLoaded', startBackgroundAudio);

startButton.addEventListener('click', async () => {
  startButton.disabled = true;
  try {
    bgAudio.pause();
    bgAudio.currentTime = 0;
  } catch (e) {}
  window.location.href = 'disclaimer.html';
});
