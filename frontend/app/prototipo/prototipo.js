const app = document.querySelector(".app-shell");
const screenRoot = document.getElementById("screen-root");
const heading = document.getElementById("screen-heading");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const themeToggle = document.getElementById("theme-toggle");
const toast = document.getElementById("toast");

const savedPrototype = JSON.parse(localStorage.getItem("edusinal-prototype") || "{}");
const requestedScreen = new URLSearchParams(location.search).get("tela");
const MAX_LIVES = 3;
const LIFE_RECHARGE_MS = 30 * 60 * 1000;
let selectedAlphabetLetter = "A";
const state = {
  screen: requestedScreen === "login" ? "login" : requestedScreen === "cadastro" ? "signup" : requestedScreen === "home" ? "trail" : savedPrototype.role === "guardian" ? "family" : savedPrototype.role ? "trail" : "intro",
  theme: savedPrototype.theme || "light",
  xp: savedPrototype.xp || 120,
  coins: savedPrototype.coins ?? 40,
  streak: savedPrototype.streak || 4,
  lives: savedPrototype.lives ?? MAX_LIVES,
  nextLifeAt: savedPrototype.nextLifeAt || null,
  name: savedPrototype.name || "Marina",
  role: savedPrototype.role === "guardian" ? "guardian" : "student",
  isRegistered: Boolean(savedPrototype.role),
  isMinor: savedPrototype.isMinor || false,
  linkedStudent: savedPrototype.linkedStudent || "",
  unlockedItems: Array.isArray(savedPrototype.unlockedItems) ? savedPrototype.unlockedItems : [],
  equippedItem: savedPrototype.equippedItem || "",
  hasFirstActivityReward: Boolean(savedPrototype.hasFirstActivityReward),
  answered: false,
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
  family: "Área do responsável",
  familyProgress: "Progresso do aluno",
  routine: "Rotina de estudos",
  guardianProfile: "Perfil do responsável",
  profile: "Meu perfil",
  more: "Mais opções",
  signup: "Criar conta",
};

const navigationByRole = {
  student: {
    label: "ESPAÇO DO ALUNO",
    items: [
      ["trail", "Home", "⌂"],
      ["signs", "Dicionário", "◉"],
      ["lesson", "Desafios", "✳"],
      ["leagues", "Ligas", "⬟"],
      ["missions", "Missões", "▣"],
      ["shop", "Lojinha", "✿"],
      ["profile", "Perfil", "●"],
      ["more", "Mais", "•••"],
    ],
  },
  guardian: {
    label: "ESPAÇO DA FAMÍLIA",
    items: [
      ["family", "Visão geral", "⌂"],
      ["familyProgress", "Progresso do aluno", "◉"],
      ["routine", "Rotina", "▦"],
      ["guardianProfile", "Meu perfil", "●"],
    ],
  },
};

const avatarItems = [
  { id: "broche-sinal", name: "Broche de sinais", icon: "🤟", source: "Recompensa da primeira atividade", reward: true },
  { id: "estrela-coral", name: "Estrela coral", icon: "✦", source: "Lojinha", cost: 25 },
  { id: "flor-amarela", name: "Flor amarela", icon: "✿", source: "Lojinha", cost: 40 },
  { id: "folha-azul", name: "Folha azul", icon: "❋", source: "Lojinha", cost: 60 },
];

function persist() {
  localStorage.setItem("edusinal-prototype", JSON.stringify({
    theme: state.theme,
    xp: state.xp,
    coins: state.coins,
    streak: state.streak,
    lives: state.lives,
    nextLifeAt: state.nextLifeAt,
    name: state.name,
    role: state.role,
    isRegistered: state.isRegistered,
    isMinor: state.isMinor,
    linkedStudent: state.linkedStudent,
    unlockedItems: state.unlockedItems,
    equippedItem: state.equippedItem,
    hasFirstActivityReward: state.hasFirstActivityReward,
  }));
}

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

function updateLifeIndicator() {
  refreshLives();
  const indicator = document.querySelector(".home-lives");
  if (!indicator) return;

  indicator.querySelector(".lives-hearts").innerHTML = Array.from(
    { length: MAX_LIVES },
    (_, index) => `<span class="life-heart${index < state.lives ? " is-full" : ""}" aria-hidden="true">♥</span>`,
  ).join("");
  indicator.querySelector(".lives-hearts").setAttribute("aria-label", `${state.lives} de ${MAX_LIVES} vidas`);
  indicator.querySelector("strong").textContent = `${state.lives} / ${MAX_LIVES}`;
  indicator.querySelector("small").textContent = timeUntilNextLife();
}

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
  heading.textContent = screenTitles[screen] || "EduSinal";
  sidebar.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  render();
  screenRoot.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderIntro() {
  return `
    <section class="intro-screen" aria-labelledby="intro-title">
      <div class="intro-copy">
        <p class="eyebrow"><span class="status-dot"></span> APRENDIZAGEM VISUAL EM LIBRAS</p>
        <h2 id="intro-title">Aprender Libras é abrir espaço para novas conexões.</h2>
        <p>O EduSinal reúne uma trilha de aprendizagem, atividades para praticar e acompanhamento para alunos e responsáveis.</p>
        <div class="intro-actions">
          <button class="button button-primary" type="button" data-screen="signup">Criar minha conta <span aria-hidden="true">→</span></button>
          <button class="text-button" type="button" data-screen="login">Já tenho cadastro <span aria-hidden="true">→</span></button>
          <a class="quiet-link" href="../../landing/index.html">Conhecer o projeto <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="intro-art"><img src="../../assets/images/Mascote%20Libras%20em%20Azul%20vibrante.png" alt="Mascote do EduSinal" /></div>
    </section>
    <section class="intro-points" aria-label="Sobre o EduSinal">
      <div><strong>Aprenda no seu ritmo</strong><span>Uma trilha visual com etapas para praticar.</span></div>
      <div><strong>Acompanhe seu caminho</strong><span>Veja atividades e progresso em um só lugar.</span></div>
      <div><strong>Conecte diferentes perfis</strong><span>Espaços pensados para alunos e responsáveis.</span></div>
    </section>`;
}

function renderTrail() {
  refreshLives();
  const hearts = Array.from({ length: MAX_LIVES }, (_, index) =>
    `<span class="life-heart${index < state.lives ? " is-full" : ""}" aria-hidden="true">♥</span>`,
  ).join("");
  return `
    <div class="home-dashboard">
      <div class="home-main-column">
        <section class="home-hero">
          <div class="home-hero-copy">
            <p class="eyebrow"><span class="status-dot"></span> SUA JORNADA EM LIBRAS</p>
            <h2>Oi, ${escapeHtml(state.name)}! <span>Pronto para aprender?</span></h2>
            <p>Um desafio rápido hoje ajuda você a se aproximar de novas conversas.</p>
            <button class="button button-primary" type="button" data-action="start-lesson" ${state.lives === 0 ? "disabled" : ""}>Iniciar desafio <span aria-hidden="true">→</span></button>
          </div>
          <div class="home-hero-art" aria-hidden="true"><span>🤟</span><small>UM SINAL<br />DE CADA VEZ</small></div>
        </section>

        <section class="home-map" aria-labelledby="path-title">
          <div class="home-map-heading">
            <div><p class="eyebrow">NÍVEL INICIANTE</p><h2 id="path-title">Sua trilha</h2></div>
            <span class="section-count">UNIDADE 01 <span aria-hidden="true">·</span> 4 etapas</span>
          </div>
          <div class="learning-route">
            <article class="route-step route-step-active"><button class="route-node node-coral" type="button" data-action="start-lesson" aria-label="Iniciar Primeiros sinais" ${state.lives === 0 ? "disabled" : ""}>01</button><span class="path-label">COMECE POR AQUI</span><h3>Primeiros sinais</h3><p>Saudações do dia a dia</p></article>
            <article class="route-step route-step-locked"><span class="route-node node-yellow" aria-label="Etapa bloqueada">02</span><span class="path-label">PRÓXIMA ETAPA</span><h3>Apresentações</h3><p>Seu nome e novas conexões</p></article>
            <article class="route-step route-step-locked"><span class="route-node node-green" aria-label="Etapa bloqueada">03</span><span class="path-label">EM SEGUIDA</span><h3>Pessoas e família</h3><p>Quem faz parte da sua vida</p></article>
            <article class="route-step route-step-locked"><span class="route-node node-blue" aria-label="Etapa bloqueada">04</span><span class="path-label">EM SEGUIDA</span><h3>Rotina e lugares</h3><p>Palavras para o cotidiano</p></article>
          </div>
        </section>
      </div>

      <aside class="home-side-column" aria-label="Resumo e tarefas">
        <section class="home-side-card home-tasks">
          <div class="home-side-heading"><span class="panel-icon" aria-hidden="true">✦</span><h2>Tarefas</h2></div>
          <button class="home-task" type="button" data-action="start-lesson" ${state.lives === 0 ? "disabled" : ""}><span class="task-check">01</span><span><strong>Faça um desafio</strong><small>Pratique uma saudação</small></span><span aria-hidden="true">→</span></button>
          <button class="home-task" type="button" data-screen="signs"><span class="task-check">02</span><span><strong>Explore o dicionário</strong><small>Descubra novos sinais</small></span><span aria-hidden="true">→</span></button>
          <button class="home-task" type="button" data-screen="missions"><span class="task-check">03</span><span><strong>Veja suas missões</strong><small>Acompanhe seus objetivos</small></span><span aria-hidden="true">→</span></button>
        </section>

        <section class="home-side-card home-stats">
          <div class="home-side-heading"><span class="panel-icon" aria-hidden="true">◷</span><h2>Seu ritmo</h2></div>
          <div class="home-stat home-lives"><span>Vidas</span><div class="lives-summary"><div class="lives-hearts" aria-label="${state.lives} de ${MAX_LIVES} vidas">${hearts}</div><strong>${state.lives} / ${MAX_LIVES}</strong><small>${timeUntilNextLife()}</small></div></div>
          <div class="home-stat"><span>Ofensiva</span><strong>${state.streak} dias</strong></div>
          <div class="home-stat"><span>Experiência</span><strong>${state.xp} XP</strong></div>
          <div class="home-stat"><span>Meta de hoje</span><strong>1 / 3 atividades</strong></div>
          <div class="progress-track" role="progressbar" aria-label="Progresso da meta diária" aria-valuenow="1" aria-valuemin="0" aria-valuemax="3"><span style="width: 34%"></span></div>
          <button class="text-button" type="button" data-screen="shop">Abrir a lojinha <span aria-hidden="true">→</span></button>
        </section>
      </aside>
    </div>
    <p class="demo-disclaimer">Pontos, sequência e conteúdo exibidos são dados demonstrativos deste protótipo.</p>`;
}

function renderLesson() {
  return `
    <section class="lesson-wrap">
      <div class="lesson-topline"><button class="back-button" type="button" data-screen="trail"><span aria-hidden="true">←</span> Voltar à trilha</button><span class="lesson-xp">✳ +20 XP</span></div>
      <div class="lesson-progress"><span></span></div>
      <div class="lesson-content">
        <p class="eyebrow">PRIMEIROS SINAIS <span class="eyebrow-separator">/</span> ETAPA 01</p>
        <h2>Qual atitude ajuda a manter uma conversa em Libras?</h2>
        <p class="lesson-hint">Escolha a melhor resposta para continuar.</p>
        <div class="answer-list" role="group" aria-label="Opções de resposta">
          <button class="answer-option" type="button" data-action="answer" data-answer="wrong">Desviar o olhar enquanto a outra pessoa sinaliza</button>
          <button class="answer-option" type="button" data-action="answer" data-answer="correct">Manter contato visual durante a conversa</button>
          <button class="answer-option" type="button" data-action="answer" data-answer="wrong">Falar mais alto para facilitar a comunicação</button>
        </div>
        <div class="answer-feedback" id="answer-feedback" aria-live="polite"></div>
        <button class="button button-primary continue-button" id="lesson-continue" type="button" data-action="finish-lesson" disabled>Conferir resposta</button>
      </div>
      <p class="demo-disclaimer">Atividade demonstrativa sobre comunicação; não substitui material didático de Libras.</p>
    </section>`;
}

function renderShop() {
  const items = avatarItems.map((item) => {
    const isOwned = state.unlockedItems.includes(item.id);
    const isEquipped = state.equippedItem === item.id;
    const isUnavailable = item.reward && !isOwned;
    const cannotAfford = !isOwned && !item.reward && state.coins < item.cost;
    const actionLabel = isEquipped ? "Em uso" : isOwned ? "Usar item" : item.reward ? "Ganhe no desafio" : `Comprar · ${item.cost} moedas`;
    return `
      <article class="shop-item">
        <div class="shop-item-art"><span class="mascot-item-icon">${item.icon}</span></div>
        <div class="shop-item-copy"><span class="shop-item-source">${item.source}</span><h3>${item.name}</h3><p>${item.reward ? "Complete sua primeira atividade para desbloquear este item." : "Um detalhe para personalizar o mascote do seu perfil."}</p></div>
        <button class="button ${isOwned ? "button-outline" : "button-primary"}" type="button" data-shop-item="${item.id}" ${isEquipped || isUnavailable || cannotAfford ? "disabled" : ""}>${actionLabel}</button>
      </article>`;
  }).join("");

  return `
    <section class="page-intro shop-intro"><div><p class="eyebrow">RECOMPENSAS DA JORNADA</p><h2>Lojinha do mascote</h2><p>Use moedas demonstrativas para escolher acessórios. Não há compras com dinheiro real.</p></div><span class="shop-balance"><span aria-hidden="true">✦</span> ${state.coins} moedas</span></section>
    <section class="shop-grid" aria-label="Itens para personalizar o mascote">${items}</section>
    <p class="demo-disclaimer">As moedas são de demonstração e os itens ficam salvos somente neste navegador.</p>`;
}

function renderFamily() {
  const learner = state.linkedStudent || state.name;
  return `
    <section class="page-intro"><div><p class="eyebrow">ACOMPANHAMENTO FAMILIAR</p><h2>Aprender também é estar por perto.</h2><p>Uma visão simples para responsáveis acompanharem a jornada de aprendizagem.</p></div><span class="demo-pill">VISÃO DEMONSTRATIVA</span></section>
    <section class="family-summary"><div class="family-student"><span class="student-avatar">${escapeHtml(learner.slice(0, 1).toUpperCase())}</span><div><span class="eyebrow">PERFIL ACOMPANHADO</span><h3>${escapeHtml(learner)}</h3><span>Trilha iniciante · Libras</span></div><span class="minor-badge">${state.isMinor ? "Menor de idade" : "Aluno"}</span></div><div class="family-stats"><div><span>Sequência atual</span><strong>${state.streak} dias</strong></div><div><span>Experiência</span><strong>${state.xp} XP</strong></div><div><span>Meta da semana</span><strong>3 de 5 dias</strong></div></div></section>
    <div class="content-grid family-grid"><section class="activity-section"><div class="section-heading"><div><p class="eyebrow">ATIVIDADE RECENTE</p><h2>Progresso da semana</h2></div></div><div class="week-chart" aria-label="Atividades concluídas nesta semana"><div><span class="bar bar-done" style="--bar: 76%"></span><small>SEG</small></div><div><span class="bar bar-done" style="--bar: 58%"></span><small>TER</small></div><div><span class="bar bar-today" style="--bar: 38%"></span><small>QUA</small></div><div><span class="bar" style="--bar: 8%"></span><small>QUI</small></div><div><span class="bar" style="--bar: 8%"></span><small>SEX</small></div><div><span class="bar" style="--bar: 8%"></span><small>SÁB</small></div><div><span class="bar" style="--bar: 8%"></span><small>DOM</small></div></div><p class="chart-caption">Atividades realizadas · dados de exemplo</p></section><aside class="family-note"><span class="panel-icon" aria-hidden="true">✦</span><p class="eyebrow">PRÓXIMA CONQUISTA</p><h3>Mais um dia de prática</h3><p>Uma atividade curta ajuda a manter o ritmo de aprendizagem.</p><button class="text-button" type="button" data-screen="trail">Ver trilha do aluno <span aria-hidden="true">→</span></button></aside></div>
    <p class="demo-disclaimer">Este protótipo não compartilha dados nem envia relatórios a responsáveis.</p>`;
}

function renderNavigation() {
  const config = navigationByRole[state.role] || navigationByRole.student;
  const activeScreens = {
    lesson: "lesson",
    familyProgress: "familyProgress",
  };
  const activeScreen = activeScreens[state.screen] || state.screen;
  document.getElementById("sidebar-label").textContent = config.label;
  document.getElementById("side-nav").innerHTML = config.items.map(([screen, label, icon], index) => `
    <button class="nav-item${activeScreen === screen ? " is-active" : ""}" type="button" data-screen="${screen}"${activeScreen === screen ? ' aria-current="page"' : ""}>
      <span class="nav-icon nav-icon-${index + 1}" aria-hidden="true">${icon}</span><span>${label}</span>
    </button>`).join("");
}

function renderSigns() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const letters = alphabet.map((letter) => {
    const isUnlocked = "ABC".includes(letter);
    const isSelected = selectedAlphabetLetter === letter;
    return `<button class="alphabet-letter${isUnlocked ? " is-unlocked" : " is-locked"}${isSelected ? " is-selected" : ""}" type="button" data-alphabet-letter="${letter}" aria-label="${isUnlocked ? `Letra ${letter}` : `Letra ${letter}, bloqueada`}" ${isUnlocked ? `aria-pressed="${isSelected}"` : "disabled"}>${isUnlocked ? "" : '<span class="alphabet-lock" aria-hidden="true">&#128274;</span>'}<span>${letter}</span></button>`;
  }).join("");

  return `
    <section class="page-intro"><div><p class="eyebrow">DICIONÁRIO DE LIBRAS</p><h2>Alfabeto manual</h2><p>Explore as primeiras letras liberadas. As próximas serão adicionadas em etapas futuras.</p></div><span class="demo-pill">3 DE 26 LETRAS</span></section>
    <section class="alphabet-section" aria-labelledby="alphabet-title"><div class="section-heading"><div><p class="eyebrow">PRIMEIROS PASSOS</p><h2 id="alphabet-title">Escolha uma letra</h2></div><span class="alphabet-legend"><span aria-hidden="true">&#128274;</span> Em breve</span></div><div class="alphabet-grid" aria-label="Alfabeto manual, letras A a Z">${letters}</div></section>
    <section class="alphabet-detail" aria-live="polite" aria-labelledby="selected-letter-title"><div class="alphabet-detail-letter" aria-hidden="true">${selectedAlphabetLetter}</div><div class="alphabet-detail-copy"><p class="eyebrow">LETRA LIBERADA</p><h2 id="selected-letter-title">Letra ${selectedAlphabetLetter}</h2><p>O material visual desta letra está sendo preparado para revisão por pessoas fluentes em Libras. Consulte um professor ou intérprete para aprender a configuração correta da mão.</p></div><span class="alphabet-detail-mark" aria-hidden="true">✳</span></section>
    <p class="demo-disclaimer">O alfabeto manual representa letras; Libras é uma língua completa, com gramática e sinais próprios.</p>`;
}

function renderLeagues() {
  const ranking = [["01", "Bia", "340 XP"], ["02", "Caio", "280 XP"], ["03", state.name, `${state.xp} XP`], ["04", "Dani", "190 XP"]];
  return `
    <section class="page-intro"><div><p class="eyebrow">APRENDER EM COMUNIDADE</p><h2>Liga da semana</h2><p>Uma prévia de como desafios amigáveis podem incentivar a prática.</p></div><span class="demo-pill">DADOS FICTÍCIOS</span></section>
    <section class="ranking-list" aria-label="Classificação semanal">${ranking.map(([position, name, points]) => `<div class="ranking-row"><span class="ranking-position">${position}</span><span class="ranking-avatar">${escapeHtml(name.slice(0, 1))}</span><strong>${escapeHtml(name)}</strong><span class="ranking-points">${points}</span></div>`).join("")}</section>
    <p class="demo-disclaimer">Classificação demonstrativa; nenhuma informação de outros alunos é real.</p>`;
}

function renderMissions() {
  return `
    <section class="page-intro"><div><p class="eyebrow">OBJETIVOS DA SEMANA</p><h2>Missões</h2><p>Metas pequenas ajudam a criar um ritmo de aprendizagem.</p></div><span class="demo-pill">1 DE 3 CONCLUÍDAS</span></section>
    <section class="mission-list"><article class="mission-row"><span class="mission-mark mission-mark-coral">✳</span><div><h3>Faça uma atividade</h3><p>Pratique um conteúdo da sua trilha.</p><div class="progress-track"><span style="width: 100%"></span></div></div><strong>1 / 1</strong></article><article class="mission-row"><span class="mission-mark mission-mark-yellow">✦</span><div><h3>Ganhe 40 XP</h3><p>Some pontos resolvendo atividades.</p><div class="progress-track"><span style="width: 45%"></span></div></div><strong>20 / 40</strong></article><article class="mission-row"><span class="mission-mark mission-mark-green">◷</span><div><h3>Pratique em 3 dias</h3><p>Volte à trilha ao longo da semana.</p><div class="progress-track"><span style="width: 34%"></span></div></div><strong>1 / 3</strong></article></section>
    <button class="button button-primary" type="button" data-screen="lesson">Praticar agora <span aria-hidden="true">→</span></button>`;
}

function renderProfile() {
  const equippedItem = avatarItems.find((item) => item.id === state.equippedItem);
  return `
    <section class="page-intro"><div><p class="eyebrow">SEU ESPAÇO</p><h2>Perfil de aluno</h2><p>Resumo do perfil de demonstração usado nesta prévia.</p></div><span class="demo-pill">ALUNO</span></section>
    <section class="account-panel profile-avatar-panel"><div class="mascot-avatar"><img src="../../assets/images/Mascote%20Libras%20em%20Azul%20vibrante.png" alt="Mascote personalizado de ${escapeHtml(state.name)}" />${equippedItem ? `<span class="mascot-accessory" aria-label="${equippedItem.name}">${equippedItem.icon}</span>` : ""}</div><div class="profile-identity"><span class="eyebrow">NOME</span><h3>${escapeHtml(state.name)}</h3><p>${state.isMinor ? "Aluno menor de idade" : "Aluno · trilha iniciante"}</p><button class="button button-outline" type="button" data-screen="shop">Personalizar mascote <span aria-hidden="true">→</span></button></div><div class="profile-currency"><div><strong>${state.xp} XP</strong><span>Experiência</span></div><div><strong>${state.coins} ✦</strong><span>Moedas</span></div><div><strong>${state.unlockedItems.length}</strong><span>Itens liberados</span></div></div></section>
    <p class="demo-disclaimer">Este perfil é local e não representa uma conta autenticada.</p>`;
}

function renderMore() {
  return `
    <section class="page-intro"><div><p class="eyebrow">EDUSINAL</p><h2>Mais opções</h2><p>Acesse outras áreas da plataforma.</p></div></section>
    <section class="more-links"><a href="#sinais" data-screen="signs"><span class="more-link-icon">▤</span><span><strong>Explorar sinais</strong><small>Acesse a biblioteca visual</small></span><span aria-hidden="true">→</span></a><a href="#lojinha" data-screen="shop"><span class="more-link-icon">✿</span><span><strong>Lojinha do mascote</strong><small>Use moedas para escolher acessórios</small></span><span aria-hidden="true">→</span></a><a href="../../landing/index.html"><span class="more-link-icon">◉</span><span><strong>Página inicial</strong><small>Volte à apresentação do EduSinal</small></span><span aria-hidden="true">↗</span></a></section>`;
}

function renderRoutine() {
  return `
    <section class="page-intro"><div><p class="eyebrow">ACOMPANHAMENTO FAMILIAR</p><h2>Rotina de estudos</h2><p>Uma visão semanal simples para combinar momentos de prática.</p></div><span class="demo-pill">PLANO DE EXEMPLO</span></section>
    <section class="routine-list"><div><strong>SEG</strong><span>Atividade curta</span><span class="routine-done">Concluída</span></div><div><strong>TER</strong><span>Revisar sinais</span><span class="routine-done">Concluída</span></div><div><strong>QUA</strong><span>Prática da trilha</span><span class="routine-today">Hoje</span></div><div><strong>QUI</strong><span>Dia livre</span><span>Planejado</span></div><div><strong>SEX</strong><span>Prática da trilha</span><span>Planejado</span></div></section>
    <p class="demo-disclaimer">Rotina ilustrativa, sem notificações ou lembretes reais.</p>`;
}

function renderGuardianProfile() {
  return `
    <section class="page-intro"><div><p class="eyebrow">ESPAÇO DA FAMÍLIA</p><h2>Perfil do responsável</h2><p>Dados de demonstração da pessoa que acompanha o aluno.</p></div><span class="demo-pill">RESPONSÁVEL</span></section>
    <section class="account-panel"><span class="student-avatar">${escapeHtml(state.name.slice(0, 1).toUpperCase())}</span><div><span class="eyebrow">RESPONSÁVEL</span><h3>${escapeHtml(state.name)}</h3><p>Aluno acompanhado: ${escapeHtml(state.linkedStudent || "não informado")}</p></div></section>`;
}

function hasStrongPassword(password) {
  return password.length >= 8
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}

function renderSignup() {
  return `
    <section class="signup-layout" aria-labelledby="signup-title"><div class="signup-intro"><p class="eyebrow">BEM-VINDE AO EDUSINAL</p><h2>Aprender Libras pode aproximar todo mundo.</h2><p>Crie seu perfil de aluno e comece uma jornada de aprendizagem no seu ritmo.</p><div class="signup-aside"><span aria-hidden="true">✳</span><span>Cadastro demonstrativo: não há autenticação conectada e os dados não são enviados.</span></div></div><div class="signup-form-panel"><div class="signup-title"><span class="eyebrow">CRIAR PERFIL</span><h3 id="signup-title">Dados do aluno</h3></div><form id="signup-form" novalidate><div class="form-grid"><label class="field-label" for="signup-name">Nome completo<input id="signup-name" name="name" autocomplete="name" placeholder="Seu nome" required /></label><label class="field-label" for="signup-age">Idade<input id="signup-age" name="age" type="number" inputmode="numeric" min="1" max="120" step="1" placeholder="Idade em anos" required /></label><label class="field-label" for="signup-email">Gmail<input id="signup-email" name="email" type="email" autocomplete="email" placeholder="voce@gmail.com" required /></label><label class="field-label" for="signup-password">Senha<input id="signup-password" name="password" type="password" autocomplete="new-password" placeholder="Crie uma senha" required /></label><label class="field-label signup-field-full" for="signup-confirm-password">Confirme a senha<input id="signup-confirm-password" name="passwordConfirmation" type="password" autocomplete="new-password" placeholder="Digite a senha novamente" required /></label></div><p class="field-hint">Use ao menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo.</p><p class="form-error" id="form-error" role="alert" aria-live="polite"></p><button class="button button-primary button-full" type="submit">Criar perfil de demonstração <span aria-hidden="true">→</span></button><p class="form-legal">A idade não é verificada e a senha não será salva nem enviada.</p><div class="login-register"><span>Já tem uma conta?</span><button class="text-button" type="button" data-screen="login">Entrar <span aria-hidden="true">→</span></button></div></form></div></section>`;
}

function renderLogin() {
  return `
    <section class="login-layout" aria-labelledby="login-title">
      <div class="signup-intro login-intro">
        <p class="eyebrow">BEM-VINDE DE VOLTA</p>
        <h2 id="login-title">Continue sua jornada no EduSinal.</h2>
        <p>Informe seus dados para validar o acesso demonstrativo.</p>
        <button class="text-button" type="button" data-screen="intro"><span aria-hidden="true">←</span> Voltar ao início</button>
      </div>
      <div class="signup-form-panel login-panel">
        <div class="signup-title"><span class="eyebrow">ACESSO</span><h3>Entrar na sua conta</h3></div>
        <form id="login-form" novalidate>
          <label class="field-label" for="login-name">Nome completo<input id="login-name" name="name" autocomplete="name" placeholder="Seu nome" required /></label>
          <label class="field-label" for="login-age">Idade<input id="login-age" name="age" type="number" inputmode="numeric" min="1" max="120" step="1" placeholder="Idade em anos" required /></label>
          <label class="field-label" for="login-email">Gmail<input id="login-email" name="email" type="email" autocomplete="username" placeholder="voce@gmail.com" required /></label>
          <label class="field-label" for="login-password">Senha<input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Sua senha" required /></label>
          <p class="field-hint">Use ao menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo.</p>
          <p class="form-error" id="login-message" role="status" aria-live="polite"></p>
          <button class="button button-primary button-full" type="submit">Entrar <span aria-hidden="true">→</span></button>
        </form>
        <p class="form-legal">Protótipo demonstrativo: a autenticação não está conectada. Os dados não serão salvos nem enviados.</p>
        <div class="login-register"><span>Ainda não tem conta?</span><button class="text-button" type="button" data-screen="signup">Criar cadastro <span aria-hidden="true">→</span></button></div>
      </div>
    </section>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function render() {
  const renderers = {
    intro: renderIntro,
    login: renderLogin,
    trail: renderTrail,
    shop: renderShop,
    signs: renderSigns,
    lesson: renderLesson,
    leagues: renderLeagues,
    missions: renderMissions,
    family: renderFamily,
    familyProgress: renderFamily,
    routine: renderRoutine,
    guardianProfile: renderGuardianProfile,
    profile: renderProfile,
    more: renderMore,
    signup: renderSignup,
  };
  heading.textContent = screenTitles[state.screen] || "EduSinal";
  app.dataset.currentScreen = state.screen;
  renderNavigation();
  screenRoot.innerHTML = renderers[state.screen]();
  app.dataset.theme = state.theme;
  themeToggle.setAttribute("aria-pressed", String(state.theme === "dark"));
  document.getElementById("theme-label").textContent = state.theme === "dark" ? "Tema claro" : "Tema escuro";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

document.addEventListener("click", (event) => {
  const alphabetButton = event.target.closest("[data-alphabet-letter]");
  if (alphabetButton && !alphabetButton.disabled) {
    selectedAlphabetLetter = alphabetButton.dataset.alphabetLetter;
    render();
    return;
  }

  const screenButton = event.target.closest("[data-screen]");
  if (screenButton) {
    event.preventDefault();
    setScreen(screenButton.dataset.screen);
    return;
  }

  const actionButton = event.target.closest("[data-action], [data-shop-item]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (actionButton.dataset.shopItem) {
    const item = avatarItems.find((entry) => entry.id === actionButton.dataset.shopItem);
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
  } else if (action === "start-lesson") {
    setScreen("lesson");
  } else if (action === "answer") {
    if (state.answered) return;
    state.answered = true;
    const isCorrect = actionButton.dataset.answer === "correct";
    if (!isCorrect) {
      refreshLives();
      state.lives = Math.max(0, state.lives - 1);
      if (state.lives < MAX_LIVES && !state.nextLifeAt) {
        state.nextLifeAt = new Date(Date.now() + LIFE_RECHARGE_MS).toISOString();
      }
      persist();
    }
    document.querySelectorAll(".answer-option").forEach((option) => {
      option.disabled = true;
      if (option.dataset.answer === "correct") option.classList.add("is-correct");
      else if (option === actionButton) option.classList.add("is-incorrect");
    });
    document.getElementById("answer-feedback").textContent = isCorrect
      ? "Isso! O contato visual ajuda a acompanhar a conversa em Libras."
      : "Quase. Em Libras, o contato visual ajuda a acompanhar a conversa.";
    const continueButton = document.getElementById("lesson-continue");
    continueButton.disabled = false;
    continueButton.textContent = isCorrect ? "Concluir atividade" : "Voltar à trilha";
    continueButton.dataset.correct = String(isCorrect);
  } else if (action === "finish-lesson") {
    if (actionButton.dataset.correct === "true") {
      if (!state.hasFirstActivityReward) {
        state.xp += 20;
        state.coins += 15;
        state.unlockedItems.push("broche-sinal");
        state.equippedItem = "broche-sinal";
        state.hasFirstActivityReward = true;
        showToast("Desafio concluído: +20 XP, +15 moedas e broche para o mascote!");
      } else {
        state.xp += 20;
        state.coins += 5;
        showToast("Atividade concluída: +20 XP e +5 moedas");
      }
      persist();
    }
    setScreen("trail");
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "theme-toggle") {
    state.theme = state.theme === "dark" ? "light" : "dark";
    persist();
    render();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    const form = event.target;
    const name = form.elements.name.value.trim();
    const age = Number(form.elements.age.value);
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;
    const message = document.getElementById("login-message");
    message.classList.remove("is-success");

    if (name.length < 3) {
      message.textContent = "Informe seu nome completo (pelo menos 3 caracteres).";
      return;
    }
    if (!Number.isInteger(age) || age < 1 || age > 120) {
      message.textContent = "Informe uma idade válida entre 1 e 120 anos.";
      return;
    }
    if (!form.elements.email.validity.valid || !email.endsWith("@gmail.com")) {
      message.textContent = "Informe um endereço válido terminado em @gmail.com.";
      return;
    }
    if (!hasStrongPassword(password)) {
      message.textContent = "A senha precisa ter 8 caracteres, maiúscula, minúscula, número e símbolo.";
      return;
    }

    message.classList.add("is-success");
    message.textContent = "Dados válidos. A autenticação ainda não está conectada; nada foi enviado ou salvo.";
    form.elements.password.value = "";
    return;
  }

  if (event.target.id === "signup-form") {
    event.preventDefault();
    const form = event.target;
    const name = form.elements.name.value.trim();
    const age = Number(form.elements.age.value);
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;
    const error = document.getElementById("form-error");
    error.textContent = "";

    if (name.length < 3) {
      error.textContent = "Informe seu nome completo (pelo menos 3 caracteres).";
      return;
    }
    if (!Number.isInteger(age) || age < 1 || age > 120) {
      error.textContent = "Informe uma idade válida entre 1 e 120 anos.";
      return;
    }
    if (!form.elements.email.validity.valid || !email.endsWith("@gmail.com")) {
      error.textContent = "Informe um endereço válido terminado em @gmail.com.";
      return;
    }
    if (!hasStrongPassword(password)) {
      error.textContent = "A senha precisa ter 8 caracteres, maiúscula, minúscula, número e símbolo.";
      return;
    }
    if (password !== form.elements.passwordConfirmation.value) {
      error.textContent = "As senhas não conferem.";
      return;
    }

    state.name = name.split(" ")[0];
    state.role = "student";
    state.isRegistered = true;
    state.isMinor = age < 18;
    state.linkedStudent = "";
    persist();
    showToast("Perfil de demonstração criado neste navegador.");
    setScreen("trail");
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

window.setInterval(() => {
  if (state.screen === "trail") updateLifeIndicator();
}, 15000);

render();