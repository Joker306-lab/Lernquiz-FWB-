const selectedMode = localStorage.getItem("quizMode") || "learn";

function createCard(item) {
  if (item.type === "link") {
    return `<a class="menu-card ${item.accent} link-card" href="${item.href}">
      <span class="number">${item.number}</span>
      <div><h2>${item.title}</h2><p>${item.description}</p></div>
    </a>`;
  }

  if (item.type === "expand") {
    const modules = item.modules.map(m => `<button class="module-pill" type="button">${m}</button>`).join("");
    return `<div>
      <button class="menu-card ${item.accent} menu-link-button" type="button" data-expand="${item.id}">
        <span class="number">${item.number}</span>
        <div><h2>${item.title}</h2><p>${item.description}</p></div>
      </button>
      <div class="subsection hidden" id="${item.id}">
        <div class="sub-header">Fachmodule</div>
        <div class="module-grid">${modules}</div>
      </div>
    </div>`;
  }

  return `<div class="menu-card ${item.accent}">
    <span class="number">${item.number}</span>
    <div><h2>${item.title}</h2><p>${item.description}</p></div>
  </div>`;
}

function updateModeUI(mode) {
  document.querySelectorAll(".mode-option").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  const badge = document.getElementById("activeModeBadge");
  badge.textContent = mode === "learn" ? "Lernmodus aktiv" : "Prüfungsmodus aktiv";
}

document.getElementById("categoryMenu").innerHTML = categoryCards.map(createCard).join("");
document.getElementById("explainMenu").innerHTML = explainCards.map(item => `
  <div class="menu-card ${item.accent}">
    <span class="number">${item.number}</span>
    <div><h2>${item.title}</h2><p>${item.description}</p></div>
  </div>
`).join("");

document.querySelectorAll("[data-expand]").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-expand");
    const target = document.getElementById(id);
    if (target) target.classList.toggle("hidden");
  });
});

document.querySelectorAll(".mode-option").forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    localStorage.setItem("quizMode", mode);
    updateModeUI(mode);
  });
});

updateModeUI(selectedMode);
