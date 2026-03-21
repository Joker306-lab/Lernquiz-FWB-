const startButton = document.getElementById('startButton');
const avatarStage = document.getElementById('avatarStage');
const startSound = new Audio('assets/start.mp3');
startSound.preload = 'auto';
let soundReady = false;

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
document.addEventListener('touchend', () => {
  avatarStage.style.transform = 'translate(0,0)';
}, { passive: true });

function playFallbackTone() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.12, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    master.connect(ctx.destination);

    const a = ctx.createOscillator();
    const b = ctx.createOscillator();
    a.type = 'sine';
    b.type = 'triangle';
    a.frequency.setValueAtTime(523.25, now);
    b.frequency.setValueAtTime(659.25, now + 0.03);
    a.connect(master);
    b.connect(master);
    a.start(now); a.stop(now + 0.28);
    b.start(now + 0.03); b.stop(now + 0.35);
  } catch (e) {}
}

async function tryAutoplayStartSound() {
  try {
    startSound.currentTime = 0;
    await startSound.play();
    soundReady = true;
  } catch (e) {
    soundReady = false;
  }
}

window.addEventListener('load', () => {
  tryAutoplayStartSound();
}, { once: true });

document.addEventListener('pointerdown', async () => {
  if (soundReady) return;
  try {
    startSound.currentTime = 0;
    await startSound.play();
    startSound.pause();
    startSound.currentTime = 0;
    soundReady = true;
  } catch (e) {}
}, { once: true });

startButton.addEventListener('click', async () => {
  startButton.disabled = true;
  let delay = 220;

  try {
    startSound.currentTime = 0;
    await startSound.play();
    delay = Number.isFinite(startSound.duration) && startSound.duration > 0
      ? Math.min(Math.max(startSound.duration * 1000, 450), 1800)
      : 900;
  } catch (e) {
    playFallbackTone();
    delay = 320;
  }

  setTimeout(() => {
    window.location.href = 'quiz.html';
  }, delay);
});
