document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.start-button');
  const scene = document.getElementById('scroll-scene');
  const root = document.documentElement;

  if (startButton) {
    startButton.addEventListener('click', () => {
      startButton.classList.add('is-loading');
    });
  }

  if (!scene || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const updateScrollAnimation = () => {
    const rect = scene.getBoundingClientRect();
    const total = Math.max(scene.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(-rect.top / total, 0), 1);

    const avatarScale = 1 + progress * 0.16;
    const avatarShift = -progress * 34;
    const copyShift = -progress * 16;
    const copyOpacity = 1 - progress * 0.18;

    root.style.setProperty('--scroll-progress', progress.toFixed(3));
    root.style.setProperty('--avatar-scale', avatarScale.toFixed(3));
    root.style.setProperty('--avatar-shift', `${avatarShift.toFixed(1)}px`);
    root.style.setProperty('--copy-shift', `${copyShift.toFixed(1)}px`);
    root.style.setProperty('--copy-opacity', copyOpacity.toFixed(3));
  };

  let ticking = false;
  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollAnimation();
        ticking = false;
      });
      ticking = true;
    }
  };

  updateScrollAnimation();
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
});
