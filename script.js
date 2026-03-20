document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.start-button');
  if (!startButton) return;

  startButton.addEventListener('click', () => {
    startButton.classList.add('is-loading');
  });
});
