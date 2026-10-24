// APLICAÇÃO PRINCIPAL
// Troca de telas, menu lateral, cliques e teclado.
// Este arquivo precisa carregar por último (depois dos outros em /js).

const app = document.querySelector(".app-shell");
const screenRoot = document.getElementById("screen-root");
const heading = document.getElementById("screen-heading");

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

// Celular: abas da barra de baixo. Perfil abre pelo mascote e Configurações
// pela engrenagem, os dois na barra de cima.
const MOBILE_TABS = ["trail", "signs", "leagues", "missions", "shop"];

// Telas que acendem uma aba mesmo não sendo ela (ex.: o editor do mascote fica no Perfil).
const PARENT_TAB = { lesson: "trail", mascot: "profile" };

function renderBottomNav() {
  const activeTab = PARENT_TAB[state.screen] || state.screen;
  const ready = readyMissionsCount();
  document.getElementById("bottom-nav").innerHTML = MOBILE_TABS.map((screen) => {
    const [, label, iconName] = navigationItems.find(([id]) => id === screen);
    const isActive = activeTab === screen;
    const badge = screen === "missions" && ready > 0 ? `<span class="bottom-badge" aria-label="${ready} para resgatar">${ready}</span>` : "";
    return `<button class="bottom-tab${isActive ? " is-active" : ""}" type="button" data-screen="${screen}"${isActive ? ' aria-current="page"' : ""}><span class="bottom-tab-icon">${icon(iconName)}</span><span>${label}</span>${badge}</button>`;
  }).join("");
}

// Celular: ofensiva, moedas e vidas na barra de cima (como no Duolingo).
function renderMobileStats() {
  refreshLives();
  document.getElementById("mobile-stats").innerHTML = `
    <button class="stat-chip stat-streak" type="button" data-screen="profile" aria-label="Ofensiva: ${state.streak} dias">${icon("fire")}<strong>${state.streak}</strong></button>
    <button class="stat-chip stat-coins" type="button" data-screen="shop" aria-label="${state.coins} moedas. Abrir lojinha">${icon("coin")}<strong>${state.coins}</strong></button>
    <button class="stat-chip stat-lives" type="button" data-screen="shop" aria-label="${state.lives} de ${MAX_LIVES} vidas">${icon("heart-fill")}<strong>${state.lives}</strong></button>`;
}

// Celular: o mascote do aluno no canto de cima leva ao Perfil.
function renderMobileAvatar() {
  const avatar = document.getElementById("mobile-avatar");
  const isActive = state.screen === "profile" || state.screen === "mascot";
  avatar.className = `mobile-avatar ${backdropClass()}${isActive ? " is-active" : ""}`;
  avatar.toggleAttribute("aria-current", isActive);
  avatar.innerHTML = mascotSvg(state.mascot, "head", "");
}

function renderNavigation() {
  const items = navigationItems.map(([screen, label, iconName], index) => {
    const isActive = state.screen === screen;
    return `
    <button class="nav-item${isActive ? " is-active" : ""}" type="button" data-screen="${screen}"${isActive ? ' aria-current="page"' : ""}>
      <span class="nav-icon nav-icon-${index + 1}">${icon(iconName)}</span><span>${label}</span>
    </button>`;
  }).join("");
  document.getElementById("side-nav").innerHTML = items;
}

// Última tela desenhada. Se for a mesma, as animações de entrada não se repetem.
let lastDrawnView = "";

// Desenha de novo a tela atual com os dados do momento.
function render() {
  refreshCalendar();
  const view = `${state.screen}|${state.focusTopic}`;
  app.dataset.redraw = view === lastDrawnView ? "on" : "off";
  lastDrawnView = view;
  heading.textContent = screenTitles[state.screen] || "EduSinal";
  app.dataset.currentScreen = state.screen;
  app.dataset.focus = state.focusTopic ? "on" : "off";
  renderNavigation();
  renderBottomNav();
  renderMobileStats();
  renderMobileAvatar();
  const settings = document.getElementById("settings-button");
  settings.classList.toggle("is-active", state.screen === "more");
  settings.toggleAttribute("aria-current", state.screen === "more");
  screenRoot.innerHTML = screenRenderers[state.screen]();
  app.dataset.theme = state.theme;
  document.documentElement.dataset.theme = state.theme;          // janelas do Bootstrap ficam fora do app
  document.documentElement.setAttribute("data-bs-theme", state.theme); // tema dos componentes do Bootstrap
  app.dataset.textSize = state.textSize;
  app.dataset.motion = state.motion;
}

// Vai para outra tela. Sem vidas, o desafio fica bloqueado (revisar continua livre).
function setScreen(screen) {
  if (screen === "lesson" && !state.currentLesson) screen = "trail"; // atividade só começa por um galho
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
  state.selectedBranch = null;
  state.editingName = false;
  if (screen !== "lesson") state.currentLesson = null;
  heading.textContent = screenTitles[screen] || "EduSinal";
  render();
  screenRoot.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ----- Modo foco (árvore de lições) -----

// Abre a árvore de uma etapa, de qualquer tela (Home, missões...).
function openTopic(topicId) {
  if (!isTopicUnlocked(topicId)) {
    showToast("Conclua a etapa anterior para liberar esta.");
    return;
  }
  setScreen("trail");
  state.focusTopic = topicId;
  render();
  document.getElementById("topic-back").focus({ preventScroll: true });
}

function closeTopic() {
  const topicId = state.focusTopic;
  state.focusTopic = null;
  state.selectedBranch = null;
  render();
  screenRoot.querySelector(`[data-topic="${topicId}"]`)?.focus({ preventScroll: true });
}

// (a atividade fica em licao.js; as ações de cada aba, no arquivo da aba)

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
  else if (action === "tap-branch") tapBranch(data.topic, data.branch);
  else if (action === "start-branch") startBranch(data.topic, data.branch);
  else if (action === "select-answer") selectAnswer(actionButton);
  else if (action === "check-answer") checkAnswer();
  else if (action === "next-question") nextQuestion();
  else if (action === "finish-lesson") finishLesson();
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
  // Perfil e Configurações
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

// Esc fecha o modo foco.
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (state.focusTopic) closeTopic();
});

// Mantém as vidas (e o tempo de recarga) atualizadas na Home e na barra do celular.
window.setInterval(() => {
  if (state.screen === "trail") updateLifeIndicator();
  renderMobileStats();
}, 15000);

// ----- Início -----
// O HTML nasce vazio; desenhamos a primeira tela aqui.
render();
