// ESTADO E REGRAS DO JOGO
// Aqui ficam os dados do aluno (XP, moedas, vidas...), o que é salvo no
// navegador e as regras que valem para várias telas: vidas, recompensas,
// ofensiva (dias seguidos) e a virada do dia e da semana.

const savedPrototype = JSON.parse(localStorage.getItem("edusinal-prototype") || "{}");
const requestedScreen = new URLSearchParams(location.search).get("tela");

const MAX_LIVES = 3;
const LIFE_RECHARGE_MS = 30 * 60 * 1000; // uma vida volta a cada 30 minutos
const DAILY_GOAL = 3;                     // exercícios por dia na meta da Home
const XP_PER_EXERCISE = 20;

// ----- Datas -----

// Data no formato "2026-10-21", no fuso do navegador.
function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Quantos dias se passaram entre duas datas no formato acima.
function daysBetween(fromKey, toKey) {
  return Math.round((Date.parse(toKey) - Date.parse(fromKey)) / 86400000);
}

// A semana começa na segunda-feira; a chave é a data dessa segunda.
function weekKey(date = new Date()) {
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return dateKey(monday);
}

function emptyDay() {
  return { date: dateKey(), exercises: 0, xp: 0, signsViewed: [], claimed: [] };
}

// ----- Estado -----

// Quem já tinha se cadastrado antes guardava "role"; continuamos aceitando isso.
const wasRegistered = Boolean(savedPrototype.isRegistered ?? savedPrototype.role);

// Nomes que podem ir na URL (?tela=ligas) e a tela de cada um.
const screensByUrlName = {
  home: "trail",
  login: "login",
  cadastro: "signup",
  dicionario: "signs",
  ligas: "leagues",
  missoes: "missions",
  lojinha: "shop",
  perfil: "profile",
  mais: "more",
};

// Tela em que o protótipo abre: pela URL ou conforme o cadastro.
function firstScreen() {
  if (screensByUrlName[requestedScreen]) return screensByUrlName[requestedScreen];
  return wasRegistered ? "trail" : "intro";
}

const state = {
  screen: firstScreen(),
  theme: savedPrototype.theme || "light",
  textSize: savedPrototype.textSize || "normal",   // "normal" ou "large"
  motion: savedPrototype.motion || "normal",       // "normal" ou "reduced"
  xp: savedPrototype.xp || 120,
  coins: savedPrototype.coins ?? 40,
  streak: savedPrototype.streak ?? 4,
  lastActiveDate: savedPrototype.lastActiveDate || null, // último dia com exercício feito
  streakFreezes: savedPrototype.streakFreezes || 0,      // protetores de ofensiva comprados
  league: savedPrototype.league || 0,                    // posição na lista LEAGUES (0 = Bronze)
  lives: savedPrototype.lives ?? MAX_LIVES,
  nextLifeAt: savedPrototype.nextLifeAt || null,
  name: savedPrototype.name || "Marina",
  isRegistered: wasRegistered,
  isMinor: savedPrototype.isMinor || false,
  unlockedItems: Array.isArray(savedPrototype.unlockedItems) ? savedPrototype.unlockedItems : [],
  equippedItem: savedPrototype.equippedItem || "",
  equippedBackground: savedPrototype.equippedBackground || "",
  hasFirstActivityReward: Boolean(savedPrototype.hasFirstActivityReward),
  completedLessons: Array.isArray(savedPrototype.completedLessons) ? savedPrototype.completedLessons : [], // ex.: "primeiros-sinais:alfabeto"
  signsSeen: Array.isArray(savedPrototype.signsSeen) ? savedPrototype.signsSeen : [], // sinais já vistos no dicionário
  daily: savedPrototype.daily || emptyDay(),                     // progresso de hoje (missões e meta)
  week: savedPrototype.week || { key: weekKey(), xp: 60, claimed: [] }, // XP da semana (ligas)

  // Daqui para baixo nada é salvo: só vale enquanto a página está aberta.
  currentLesson: null,     // galho que o aluno está fazendo agora
  answered: false,         // já respondeu a pergunta da tela atual?
  focusTopic: null,        // etapa aberta no modo foco
  selectedLetter: "A",     // letra escolhida no dicionário
  selectedWord: null,      // palavra escolhida no dicionário
  dictionaryCategory: "alfabeto",
  dictionaryQuery: "",
  editingName: false,      // perfil: mostrando o campo para trocar o nome?
};

const screenTitles = {
  intro: "Conheça o EduSinal",
  login: "Entrar",
  trail: "Minha trilha",
  shop: "Lojinha do EduSinal",
  signs: "Dicionário",
  lesson: "Atividade",
  leagues: "Ligas",
  missions: "Missões",
  profile: "Meu perfil",
  more: "Mais opções",
  signup: "Criar conta",
};

// Itens do menu lateral: [tela, nome, ícone]
const navigationItems = [
  ["trail", "Home", "⌂"],
  ["signs", "Dicionário", "◉"],
  ["leagues", "Ligas", "⬟"],
  ["missions", "Missões", "▣"],
  ["shop", "Lojinha", "✿"],
  ["profile", "Perfil", "●"],
  ["more", "Mais", "•••"],
];

// Salva no navegador só o que precisa continuar na próxima visita.
function persist() {
  localStorage.setItem("edusinal-prototype", JSON.stringify({
    theme: state.theme,
    textSize: state.textSize,
    motion: state.motion,
    xp: state.xp,
    coins: state.coins,
    streak: state.streak,
    lastActiveDate: state.lastActiveDate,
    streakFreezes: state.streakFreezes,
    league: state.league,
    lives: state.lives,
    nextLifeAt: state.nextLifeAt,
    name: state.name,
    isRegistered: state.isRegistered,
    isMinor: state.isMinor,
    unlockedItems: state.unlockedItems,
    equippedItem: state.equippedItem,
    equippedBackground: state.equippedBackground,
    hasFirstActivityReward: state.hasFirstActivityReward,
    completedLessons: state.completedLessons,
    signsSeen: state.signsSeen,
    daily: state.daily,
    week: state.week,
  }));
}

// ----- Virada do dia e da semana -----

// Chamado antes de desenhar cada tela: confere se virou o dia ou a semana.
function refreshCalendar() {
  let changed = false;
  if (state.daily.date !== dateKey()) {
    state.daily = emptyDay(); // missões e meta diária recomeçam
    changed = true;
  }
  if (state.week.key !== weekKey()) {
    closeLeagueWeek(); // fica em telas-ligas.js: sobe ou desce de liga
    changed = true;
  }
  if (checkStreak()) changed = true;
  if (changed) persist();
}

// Se o aluno ficou dias sem praticar, a ofensiva zera, a não ser que ele
// tenha protetores de ofensiva (um para cada dia perdido).
function checkStreak() {
  if (!state.lastActiveDate) return false;
  const missedDays = daysBetween(state.lastActiveDate, dateKey()) - 1;
  if (missedDays <= 0 || state.streak === 0) return false;

  if (state.streakFreezes >= missedDays) {
    state.streakFreezes -= missedDays;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    state.lastActiveDate = dateKey(yesterday);
    showToast(`Seu protetor salvou a ofensiva de ${state.streak} dias!`);
  } else {
    state.streak = 0;
  }
  return true;
}

// Conta um exercício novo para a meta do dia, as missões, a liga e a ofensiva.
function registerExercise(xpGained) {
  state.daily.exercises += 1;
  state.daily.xp += xpGained;
  state.week.xp += xpGained;
  if (state.lastActiveDate !== dateKey()) {
    state.streak += 1;
    state.lastActiveDate = dateKey();
  }
}

// ----- Vidas -----

// Devolve as vidas que já tiveram tempo de recarregar.
function refreshLives() {
  if (state.lives >= MAX_LIVES) {
    state.lives = MAX_LIVES;
    state.nextLifeAt = null;
    return;
  }

  const now = Date.now();
  let nextLifeAt = Date.parse(state.nextLifeAt || "");
  if (!Number.isFinite(nextLifeAt)) {
    nextLifeAt = now + LIFE_RECHARGE_MS;
  }

  let livesChanged = false;
  while (state.lives < MAX_LIVES && now >= nextLifeAt) {
    state.lives += 1;
    nextLifeAt += LIFE_RECHARGE_MS;
    livesChanged = true;
  }

  state.nextLifeAt = state.lives >= MAX_LIVES ? null : new Date(nextLifeAt).toISOString();
  if (livesChanged) persist();
}

function timeUntilNextLife() {
  if (state.lives >= MAX_LIVES || !state.nextLifeAt) return "Vidas completas";
  const minutes = Math.max(1, Math.ceil((Date.parse(state.nextLifeAt) - Date.now()) / 60000));
  return `+1 em ${minutes} min`;
}

// Escreve de novo os corações na Home sem redesenhar a tela inteira.
function updateLifeIndicator() {
  refreshLives();
  const indicator = document.querySelector(".home-lives");
  if (!indicator) return;

  indicator.querySelector(".lives-hearts").innerHTML = livesHeartsHtml();
  indicator.querySelector(".lives-hearts").setAttribute("aria-label", `${state.lives} de ${MAX_LIVES} vidas`);
  indicator.querySelector("strong").textContent = `${state.lives} / ${MAX_LIVES}`;
  indicator.querySelector("small").textContent = timeUntilNextLife();
}

// Perde uma vida por resposta errada e começa a contar a recarga.
function loseLife() {
  refreshLives();
  state.lives = Math.max(0, state.lives - 1);
  if (state.lives < MAX_LIVES && !state.nextLifeAt) {
    state.nextLifeAt = new Date(Date.now() + LIFE_RECHARGE_MS).toISOString();
  }
  persist();
}

// ----- Recompensas -----

// Chamado quando o aluno acerta e conclui um exercício pela primeira vez.
function giveActivityReward() {
  state.xp += XP_PER_EXERCISE;
  registerExercise(XP_PER_EXERCISE);
  if (!state.hasFirstActivityReward) {
    state.coins += 15;
    state.unlockedItems.push("broche-sinal");
    state.equippedItem = "broche-sinal";
    state.hasFirstActivityReward = true;
    showToast("Desafio concluído: +20 XP, +15 moedas e broche para o mascote!");
  } else {
    state.coins += 5;
    showToast("Atividade concluída: +20 XP e +5 moedas");
  }
  persist();
}

// ----- Utilidades -----

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

// Corações cheios e vazios, usados na Home e no placar do modo foco.
function livesHeartsHtml() {
  return Array.from({ length: MAX_LIVES }, (_, index) =>
    `<span class="life-heart${index < state.lives ? " is-full" : ""}" aria-hidden="true">♥</span>`,
  ).join("");
}

// Barra de progresso acessível (missões, conquistas, meta do dia).
function progressBarHtml(value, target, label) {
  const shown = Math.min(value, target);
  const percent = Math.round((shown / target) * 100);
  return `<div class="progress-track" role="progressbar" aria-label="${label}" aria-valuenow="${shown}" aria-valuemin="0" aria-valuemax="${target}"><span style="width: ${percent}%"></span></div>`;
}
