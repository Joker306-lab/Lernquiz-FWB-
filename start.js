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

function playStartChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return 260;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.14, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    master.connect(ctx.destination);

    const notes = [523.25, 659.25];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.06);

      gain.gain.setValueAtTime(0.0001, now + index * 0.06);
      gain.gain.linearRampToValueAtTime(0.4, now + index * 0.06 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.06 + 0.24);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + 0.26);
    });

    return 420;
  } catch (e) {
    return 220;
  }
}

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  const delay = playStartChime();
  setTimeout(() => {
    window.location.href = 'disclaimer.html';
  }, delay);
});
