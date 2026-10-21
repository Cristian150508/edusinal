// APLICAÇÃO PRINCIPAL
// Troca de telas, menu lateral, cliques e teclado.
// Este arquivo precisa carregar por último (depois dos outros em /js).

const app = document.querySelector(".app-shell");
const screenRoot = document.getElementById("screen-root");
const heading = document.getElementById("screen-heading");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");

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
  mascot: renderMascotEditor,
};

// ----- Desenho da página -----

// Celular: abas da barra de baixo (o resto fica no menu ☰).
const MOBILE_TABS = ["trail", "signs", "leagues", "missions", "profile"];

// Telas que acendem uma aba mesmo não sendo ela (ex.: o editor do mascote fica no Perfil).
const PARENT_TAB = { lesson: "trail", mascot: "profile" };

function renderBottomNav() {
  const activeTab = PARENT_TAB[state.screen] || state.screen;
  const ready = readyMissionsCount();
  document.getElementById("bottom-nav").innerHTML = MOBILE_TABS.map((screen) => {
    const [, label, icon] = navigationItems.find(([id]) => id === screen);
    const isActive = activeTab === screen;
    const badge = screen === "missions" && ready > 0 ? `<span class="bottom-badge" aria-label="${ready} para resgatar">${ready}</span>` : "";
    return `<button class="bottom-tab${isActive ? " is-active" : ""}" type="button" data-screen="${screen}"${isActive ? ' aria-current="page"' : ""}><span class="bottom-tab-icon" aria-hidden="true">${icon}</span><span>${label}</span>${badge}</button>`;
  }).join("");
}

// Celular: ofensiva, moedas e vidas na barra de cima (como no Duolingo).
function renderMobileStats() {
  refreshLives();
  document.getElementById("mobile-stats").innerHTML = `
    <button class="stat-chip stat-streak" type="button" data-screen="profile" aria-label="Ofensiva: ${state.streak} dias"><span aria-hidden="true">🔥</span><strong>${state.streak}</strong></button>
    <button class="stat-chip stat-coins" type="button" data-screen="shop" aria-label="${state.coins} moedas. Abrir lojinha"><span aria-hidden="true">✦</span><strong>${state.coins}</strong></button>
    <button class="stat-chip stat-lives" type="button" data-screen="shop" aria-label="${state.lives} de ${MAX_LIVES} vidas"><span aria-hidden="true">♥</span><strong>${state.lives}</strong></button>`;
}

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
  refreshCalendar();
  heading.textContent = screenTitles[state.screen] || "EduSinal";
  app.dataset.currentScreen = state.screen;
  app.dataset.focus = state.focusTopic ? "on" : "off";
  renderNavigation();
  renderBottomNav();
  renderMobileStats();
  screenRoot.innerHTML = screenRenderers[state.screen]();
  app.dataset.theme = state.theme;
  app.dataset.textSize = state.textSize;
  app.dataset.motion = state.motion;
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
  state.editingName = false;
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

// ----- Atividade -----
// (as ações de cada aba ficam no arquivo da aba: telas-lojinha.js, telas-missoes.js...)

// 1º passo: o aluno escolhe uma resposta (pode trocar antes de conferir).
function selectAnswer(clickedButton) {
  if (state.answered) return;
  document.querySelectorAll(".answer-option").forEach((option) => {
    option.classList.toggle("is-selected", option === clickedButton);
    option.setAttribute("aria-pressed", String(option === clickedButton));
  });
  document.getElementById("lesson-continue").disabled = false;
}

// 2º passo: "Conferir" mostra se acertou. Errar gasta uma vida.
function checkAnswer() {
  const chosen = document.querySelector(".answer-option.is-selected");
  if (state.answered || !chosen) return;
  state.answered = true;
  const isCorrect = chosen.dataset.answer === "correct";
  if (!isCorrect) loseLife();

  document.querySelectorAll(".answer-option").forEach((option) => {
    option.disabled = true;
    if (option.dataset.answer === "correct") option.classList.add("is-correct");
    else if (option === chosen) option.classList.add("is-incorrect");
  });
  document.getElementById("lesson-progress-bar").style.width = "100%";
  document.getElementById("answer-feedback").textContent = isCorrect
    ? "Isso! O contato visual ajuda a acompanhar a conversa em Libras."
    : "Quase. Em Libras, o contato visual ajuda a acompanhar a conversa.";

  const continueButton = document.getElementById("lesson-continue");
  continueButton.dataset.action = "finish-lesson";
  continueButton.dataset.correct = String(isCorrect);
  continueButton.textContent = isCorrect ? "Concluir atividade" : "Continuar";
}

// Termina a atividade. Se veio de um galho da árvore, volta para a árvore.
// A recompensa só vem na primeira vez que o galho é concluído.
// Sair da atividade sem terminar: volta para a árvore se veio de um galho.
function leaveLesson() {
  const lesson = state.currentLesson;
  setScreen("trail");
  if (lesson) openTopic(lesson.topicId);
}

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
    selectLetter(letterButton.dataset.alphabetLetter);
    return;
  }

  const screenButton = event.target.closest("[data-screen]");
  if (screenButton) {
    event.preventDefault();
    setScreen(screenButton.dataset.screen);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  const data = actionButton.dataset;

  // Trilha e atividade
  if (action === "open-topic") openTopic(data.topic);
  else if (action === "close-topic") closeTopic();
  else if (action === "start-branch") startBranch(data.topic, data.branch);
  else if (action === "select-answer") selectAnswer(actionButton);
  else if (action === "check-answer") checkAnswer();
  else if (action === "finish-lesson") finishLesson(actionButton);
  else if (action === "leave-lesson") leaveLesson();
  // Dicionário
  else if (action === "dictionary-category") chooseDictionaryCategory(data.category);
  else if (action === "select-word") selectWord(data.word);
  // Missões e lojinha
  else if (action === "claim-mission") claimMission(data.scope, data.mission);
  else if (action === "buy-power") buyPowerUp(data.power);
  // Mascote
  else if (action === "mascot-item") chooseMascotItem(data.slot, data.item);
  else if (action === "mascot-tab") chooseMascotTab(data.slot);
  else if (action === "mascot-reset") resetMascotLook();
  // Perfil e "Mais"
  else if (action === "edit-name") setEditingName(true);
  else if (action === "cancel-name") setEditingName(false);
  else if (action === "set-theme") setTheme(data.value);
  else if (action === "set-text-size") setTextSize(data.value);
  else if (action === "set-motion") setMotion(data.value);
  else if (action === "reset-demo") resetDemo();
  else if (action === "logout") logout();
});

// Busca do dicionário: atualiza a lista a cada letra digitada.
document.addEventListener("input", (event) => {
  if (event.target.id === "dictionary-search") searchDictionary(event.target.value);
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    handleLoginSubmit(event.target);
  } else if (event.target.id === "signup-form") {
    event.preventDefault();
    handleSignupSubmit(event.target);
  } else if (event.target.id === "profile-name-form") {
    event.preventDefault();
    saveName(event.target);
  }
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

// Mantém as vidas (e o tempo de recarga) atualizadas na Home e na barra do celular.
window.setInterval(() => {
  if (state.screen === "trail") updateLifeIndicator();
  renderMobileStats();
}, 15000);

// ----- Início -----
// O HTML nasce vazio; desenhamos a primeira tela aqui.
render();
