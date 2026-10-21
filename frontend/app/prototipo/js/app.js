// APLICAÇÃO PRINCIPAL
// Troca de telas, menu lateral, cliques e teclado.
// Este arquivo precisa carregar por último (depois dos outros em /js).

const app = document.querySelector(".app-shell");
const screenRoot = document.getElementById("screen-root");
const heading = document.getElementById("screen-heading");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const themeToggle = document.getElementById("theme-toggle");

// Cada tela e a função que desenha o HTML dela.
const screenRenderers = {
  intro: renderIntro,
  login: renderLogin,
  signup: renderSignup,
  trail: renderTrail,
  lesson: renderLesson,
  signs: renderSigns,
  leagues: renderLeagues,
  missions: renderMissions,
  shop: renderShop,
  profile: renderProfile,
  more: renderMore,
};

// ----- Desenho da página -----

function renderNavigation() {
  document.getElementById("sidebar-label").textContent = "ESPAÇO DO ALUNO";
  document.getElementById("side-nav").innerHTML = navigationItems.map(([screen, label, icon], index) => {
    const isActive = state.screen === screen;
    return `
    <button class="nav-item${isActive ? " is-active" : ""}" type="button" data-screen="${screen}"${isActive ? ' aria-current="page"' : ""}>
      <span class="nav-icon nav-icon-${index + 1}" aria-hidden="true">${icon}</span><span>${label}</span>
    </button>`;
  }).join("");
}

// Desenha de novo a tela atual com os dados do momento.
function render() {
  heading.textContent = screenTitles[state.screen] || "EduSinal";
  app.dataset.currentScreen = state.screen;
  app.dataset.focus = state.focusTopic ? "on" : "off";
  renderNavigation();
  screenRoot.innerHTML = screenRenderers[state.screen]();
  app.dataset.theme = state.theme;
  themeToggle.setAttribute("aria-pressed", String(state.theme === "dark"));
  document.getElementById("theme-label").textContent = state.theme === "dark" ? "Tema claro" : "Tema escuro";
}

// Vai para outra tela. Sem vidas, o desafio fica bloqueado (revisar continua livre).
function setScreen(screen) {
  if (screen === "lesson") {
    refreshLives();
    if (state.lives === 0) {
      showToast("Suas vidas estão recarregando. Você ainda pode revisar sinais e conteúdos.");
      return;
    }
  }
  state.screen = screen;
  state.answered = false;
  state.focusTopic = null;
  if (screen !== "lesson") state.currentLesson = null;
  heading.textContent = screenTitles[screen] || "EduSinal";
  sidebar.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  render();
  screenRoot.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ----- Modo foco (árvore de lições) -----

// Abre a árvore de uma etapa, de qualquer tela (Home, missões...).
function openTopic(topicId) {
  setScreen("trail");
  state.focusTopic = topicId;
  render();
  document.getElementById("topic-back").focus({ preventScroll: true });
}

function closeTopic() {
  const topicId = state.focusTopic;
  state.focusTopic = null;
  render();
  screenRoot.querySelector(`[data-topic="${topicId}"]`)?.focus({ preventScroll: true });
}

// ----- Ações dos botões -----

function buyOrEquipItem(itemId) {
  const item = avatarItems.find((entry) => entry.id === itemId);
  if (!item) return;
  const isOwned = state.unlockedItems.includes(item.id);

  if (!isOwned && item.reward) {
    showToast("Complete a primeira atividade para receber este item.");
    return;
  }
  if (!isOwned && state.coins < item.cost) {
    showToast("Você ainda não tem moedas suficientes.");
    return;
  }
  if (!isOwned) {
    state.coins -= item.cost;
    state.unlockedItems.push(item.id);
  }
  state.equippedItem = item.id;
  persist();
  render();
  showToast(`${item.name} equipado no mascote.`);
}

function answerQuestion(clickedButton) {
  if (state.answered) return;
  state.answered = true;
  const isCorrect = clickedButton.dataset.answer === "correct";
  if (!isCorrect) loseLife();

  document.querySelectorAll(".answer-option").forEach((option) => {
    option.disabled = true;
    if (option.dataset.answer === "correct") option.classList.add("is-correct");
    else if (option === clickedButton) option.classList.add("is-incorrect");
  });
  document.getElementById("answer-feedback").textContent = isCorrect
    ? "Isso! O contato visual ajuda a acompanhar a conversa em Libras."
    : "Quase. Em Libras, o contato visual ajuda a acompanhar a conversa.";

  const continueButton = document.getElementById("lesson-continue");
  continueButton.disabled = false;
  continueButton.textContent = isCorrect ? "Concluir atividade" : "Voltar à trilha";
  continueButton.dataset.correct = String(isCorrect);
}

// Termina a atividade. Se veio de um galho da árvore, volta para a árvore.
// A recompensa só vem na primeira vez que o galho é concluído.
function finishLesson(continueButton) {
  const lesson = state.currentLesson;
  if (continueButton.dataset.correct === "true") {
    const isFirstTime = lesson ? markLessonDone(lesson.topicId, lesson.branchId) : true;
    if (isFirstTime) giveActivityReward();
  }
  setScreen("trail");
  if (lesson) openTopic(lesson.topicId);
}

function startBranch(topicId, branchId) {
  state.currentLesson = { topicId, branchId };
  setScreen("lesson");
}

// ----- Eventos -----

document.addEventListener("click", (event) => {
  const letterButton = event.target.closest("[data-alphabet-letter]");
  if (letterButton && !letterButton.disabled) {
    state.selectedLetter = letterButton.dataset.alphabetLetter;
    render();
    return;
  }

  const screenButton = event.target.closest("[data-screen]");
  if (screenButton) {
    event.preventDefault();
    setScreen(screenButton.dataset.screen);
    return;
  }

  const shopButton = event.target.closest("[data-shop-item]");
  if (shopButton) {
    buyOrEquipItem(shopButton.dataset.shopItem);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === "open-topic") openTopic(actionButton.dataset.topic);
  else if (action === "close-topic") closeTopic();
  else if (action === "start-branch") startBranch(actionButton.dataset.topic, actionButton.dataset.branch);
  else if (action === "answer") answerQuestion(actionButton);
  else if (action === "finish-lesson") finishLesson(actionButton);
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    handleLoginSubmit(event.target);
  } else if (event.target.id === "signup-form") {
    event.preventDefault();
    handleSignupSubmit(event.target);
  }
});

themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  persist();
  render();
});

menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Esc fecha o modo foco e o menu do celular.
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (state.focusTopic) closeTopic();
  sidebar.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

// Mantém o tempo de recarga das vidas atualizado na Home.
window.setInterval(() => {
  if (state.screen === "trail") updateLifeIndicator();
}, 15000);

// ----- Início -----
// O HTML nasce vazio; desenhamos a primeira tela aqui.
render();
