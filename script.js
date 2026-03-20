document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.start-button');
  const root = document.documentElement;
  const hero = document.getElementById('hero');

  if (startButton) {
    startButton.addEventListener('click', () => {
      startButton.classList.add('is-loading');
    });
  }

  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const applyParallax = (clientX, clientY) => {
    const rect = hero.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;

    const limitedX = clamp(x, -1, 1);
    const limitedY = clamp(y, -1, 1);

    root.style.setProperty('--figure-x', `${(limitedX * 9).toFixed(1)}px`);
    root.style.setProperty('--figure-y', `${(limitedY * -10).toFixed(1)}px`);
    root.style.setProperty('--copy-x', `${(limitedX * -4).toFixed(1)}px`);
    root.style.setProperty('--copy-y', `${(limitedY * -3).toFixed(1)}px`);
    root.style.setProperty('--tilt-x', `${(limitedY * 2.8).toFixed(2)}deg`);
    root.style.setProperty('--tilt-y', `${(limitedX * -3.4).toFixed(2)}deg`);
  };

  const resetParallax = () => {
    root.style.setProperty('--figure-x', '0px');
    root.style.setProperty('--figure-y', '0px');
    root.style.setProperty('--copy-x', '0px');
    root.style.setProperty('--copy-y', '0px');
    root.style.setProperty('--tilt-x', '0deg');
    root.style.setProperty('--tilt-y', '0deg');
  };

  window.addEventListener('mousemove', (event) => {
    applyParallax(event.clientX, event.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    applyParallax(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener('mouseleave', resetParallax, { passive: true });
  window.addEventListener('touchend', resetParallax, { passive: true });
  window.addEventListener('touchcancel', resetParallax, { passive: true });
});
