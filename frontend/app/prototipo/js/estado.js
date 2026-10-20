// ESTADO E REGRAS DO JOGO
// Aqui ficam os dados do aluno (XP, moedas, vidas...), o que é salvo no
// navegador e as regras de vidas. Nenhuma tela é desenhada neste arquivo.

const savedPrototype = JSON.parse(localStorage.getItem("edusinal-prototype") || "{}");
const requestedScreen = new URLSearchParams(location.search).get("tela");

const MAX_LIVES = 3;
const LIFE_RECHARGE_MS = 30 * 60 * 1000; // uma vida volta a cada 30 minutos

// Quem já tinha se cadastrado antes guardava "role"; continuamos aceitando isso.
const wasRegistered = Boolean(savedPrototype.isRegistered ?? savedPrototype.role);

// Tela em que o protótipo abre: pela URL (?tela=login) ou conforme o cadastro.
function firstScreen() {
  if (requestedScreen === "login") return "login";
  if (requestedScreen === "cadastro") return "signup";
  if (requestedScreen === "home") return "trail";
  return wasRegistered ? "trail" : "intro";
}

const state = {
  screen: firstScreen(),
  theme: savedPrototype.theme || "light",
  xp: savedPrototype.xp || 120,
  coins: savedPrototype.coins ?? 40,
  streak: savedPrototype.streak || 4,
  lives: savedPrototype.lives ?? MAX_LIVES,
  nextLifeAt: savedPrototype.nextLifeAt || null,
  name: savedPrototype.name || "Marina",
  isRegistered: wasRegistered,
  isMinor: savedPrototype.isMinor || false,
  unlockedItems: Array.isArray(savedPrototype.unlockedItems) ? savedPrototype.unlockedItems : [],
  equippedItem: savedPrototype.equippedItem || "",
  hasFirstActivityReward: Boolean(savedPrototype.hasFirstActivityReward),
  answered: false,      // já respondeu a pergunta da tela atual? (não é salvo)
  focusTopic: null,     // etapa aberta no modo foco (não é salvo)
  selectedLetter: "A",  // letra escolhida no dicionário (não é salva)
};

const screenTitles = {
  intro: "Conheça o EduSinal",
  login: "Entrar",
  trail: "Minha trilha",
  shop: "Lojinha do EduSinal",
  signs: "Sinais",
  lesson: "Atividade do dia",
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
  ["lesson", "Desafios", "✳"],
  ["leagues", "Ligas", "⬟"],
  ["missions", "Missões", "▣"],
  ["shop", "Lojinha", "✿"],
  ["profile", "Perfil", "●"],
  ["more", "Mais", "•••"],
];

const avatarItems = [
  { id: "broche-sinal", name: "Broche de sinais", icon: "🤟", source: "Recompensa da primeira atividade", reward: true },
  { id: "estrela-coral", name: "Estrela coral", icon: "✦", source: "Lojinha", cost: 25 },
  { id: "flor-amarela", name: "Flor amarela", icon: "✿", source: "Lojinha", cost: 40 },
  { id: "folha-azul", name: "Folha azul", icon: "❋", source: "Lojinha", cost: 60 },
];

// Salva no navegador só o que precisa continuar na próxima visita.
function persist() {
  localStorage.setItem("edusinal-prototype", JSON.stringify({
    theme: state.theme,
    xp: state.xp,
    coins: state.coins,
    streak: state.streak,
    lives: state.lives,
    nextLifeAt: state.nextLifeAt,
    name: state.name,
    isRegistered: state.isRegistered,
    isMinor: state.isMinor,
    unlockedItems: state.unlockedItems,
    equippedItem: state.equippedItem,
    hasFirstActivityReward: state.hasFirstActivityReward,
  }));
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

// Chamado quando o aluno acerta e conclui a atividade.
function giveActivityReward() {
  state.xp += 20;
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
