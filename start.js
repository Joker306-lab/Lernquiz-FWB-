const startButton = document.getElementById('startButton');
const avatarStage = document.getElementById('avatarStage');

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

function playFallbackStartTone() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return 220;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.18, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    master.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now + 0.02);

    osc1.connect(master);
    osc2.connect(master);

    osc1.start(now);
    osc1.stop(now + 0.22);
    osc2.start(now + 0.03);
    osc2.stop(now + 0.24);

    return 260;
  } catch (error) {
    return 150;
  }
}

async function playStartSound() {
  const audio = new Audio('assets/start.mp3');
  audio.preload = 'auto';
  audio.volume = 1;
  audio.load();

  try {
    await audio.play();
    const durationMs = Number.isFinite(audio.duration) && audio.duration > 0
      ? Math.min(Math.max(audio.duration * 1000, 450), 1800)
      : 900;
    return durationMs;
  } catch (error) {
    return playFallbackStartTone();
  }
}

startButton.addEventListener('click', async () => {
  startButton.disabled = true;
  const waitMs = await playStartSound();

  setTimeout(() => {
    window.location.href = 'quiz.html';
  }, waitMs);
});
