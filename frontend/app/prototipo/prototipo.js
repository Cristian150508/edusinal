const app = document.querySelector(".app-shell");
const screenRoot = document.getElementById("screen-root");
const heading = document.getElementById("screen-heading");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const themeToggle = document.getElementById("theme-toggle");
const toast = document.getElementById("toast");

const savedPrototype = JSON.parse(localStorage.getItem("edusinal-prototype") || "{}");
const requestedScreen = new URLSearchParams(location.search).get("tela");
const state = {
  screen: requestedScreen === "login" ? "login" : requestedScreen === "cadastro" ? "signup" : requestedScreen === "home" ? "trail" : savedPrototype.role === "guardian" ? "family" : savedPrototype.role ? "trail" : "intro",
  theme: savedPrototype.theme || "light",
  xp: savedPrototype.xp || 120,
  coins: savedPrototype.coins ?? 40,
  streak: savedPrototype.streak || 4,
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

function setScreen(screen) {
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
  return `
    <div class="home-dashboard">
      <div class="home-main-column">
        <section class="home-hero">
          <div class="home-hero-copy">
            <p class="eyebrow"><span class="status-dot"></span> SUA JORNADA EM LIBRAS</p>
            <h2>Oi, ${escapeHtml(state.name)}! <span>Pronto para aprender?</span></h2>
            <p>Um desafio rápido hoje ajuda você a se aproximar de novas conversas.</p>
            <button class="button button-primary" type="button" data-action="start-lesson">Iniciar desafio <span aria-hidden="true">→</span></button>
          </div>
          <div class="home-hero-art" aria-hidden="true"><span>🤟</span><small>UM SINAL<br />DE CADA VEZ</small></div>
        </section>

        <section class="home-map" aria-labelledby="path-title">
          <div class="home-map-heading">
            <div><p class="eyebrow">NÍVEL INICIANTE</p><h2 id="path-title">Sua trilha</h2></div>
            <span class="section-count">UNIDADE 01 <span aria-hidden="true">·</span> 4 etapas</span>
          </div>
          <div class="learning-route">
            <article class="route-step route-step-active"><button class="route-node node-coral" type="button" data-action="start-lesson" aria-label="Iniciar Primeiros sinais">01</button><span class="path-label">COMECE POR AQUI</span><h3>Primeiros sinais</h3><p>Saudações do dia a dia</p></article>
            <article class="route-step route-step-locked"><span class="route-node node-yellow" aria-label="Etapa bloqueada">02</span><span class="path-label">PRÓXIMA ETAPA</span><h3>Apresentações</h3><p>Seu nome e novas conexões</p></article>
            <article class="route-step route-step-locked"><span class="route-node node-green" aria-label="Etapa bloqueada">03</span><span class="path-label">EM SEGUIDA</span><h3>Pessoas e família</h3><p>Quem faz parte da sua vida</p></article>
            <article class="route-step route-step-locked"><span class="route-node node-blue" aria-label="Etapa bloqueada">04</span><span class="path-label">EM SEGUIDA</span><h3>Rotina e lugares</h3><p>Palavras para o cotidiano</p></article>
          </div>
        </section>
      </div>

      <aside class="home-side-column" aria-label="Resumo e tarefas">
        <section class="home-side-card home-tasks">
          <div class="home-side-heading"><span class="panel-icon" aria-hidden="true">✦</span><h2>Tarefas</h2></div>
          <button class="home-task" type="button" data-action="start-lesson"><span class="task-check">01</span><span><strong>Faça um desafio</strong><small>Pratique uma saudação</small></span><span aria-hidden="true">→</span></button>
          <button class="home-task" type="button" data-screen="signs"><span class="task-check">02</span><span><strong>Explore o dicionário</strong><small>Descubra novos sinais</small></span><span aria-hidden="true">→</span></button>
          <button class="home-task" type="button" data-screen="missions"><span class="task-check">03</span><span><strong>Veja suas missões</strong><small>Acompanhe seus objetivos</small></span><span aria-hidden="true">→</span></button>
        </section>

        <section class="home-side-card home-stats">
          <div class="home-side-heading"><span class="panel-icon" aria-hidden="true">◷</span><h2>Seu ritmo</h2></div>
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
  return `
    <section class="page-intro"><div><p class="eyebrow">BIBLIOTECA VISUAL</p><h2>Explore os sinais</h2><p>Um espaço para consultar vocabulário em Libras por tema.</p></div><span class="demo-pill">CONTEÚDO EM CONSTRUÇÃO</span></section>
    <section class="vocabulary-grid"><article class="vocabulary-item"><span class="vocabulary-icon">01</span><div><span class="path-label">SAUDAÇÕES</span><h3>Olá e despedidas</h3><p>Vídeo demonstrativo será inserido nesta etapa.</p></div></article><article class="vocabulary-item"><span class="vocabulary-icon">02</span><div><span class="path-label">DIA A DIA</span><h3>Por favor e obrigado</h3><p>Vídeo demonstrativo será inserido nesta etapa.</p></div></article><article class="vocabulary-item"><span class="vocabulary-icon">03</span><div><span class="path-label">PESSOAS</span><h3>Família e amigos</h3><p>Vídeo demonstrativo será inserido nesta etapa.</p></div></article></section>
    <p class="demo-disclaimer">Os itens mostram a organização da biblioteca; ainda não são materiais de ensino.</p>`;
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
    <section class="account-panel profile-avatar-panel"><div class="mascot-avatar"><img src="../../assets/images/Mascote%20Libras%20em%20Azul%20vibrante.png" alt="Mascote personalizado de ${escapeHtml(state.name)}" />${equippedItem ? `<span class="mascot-accessory" aria-label="${equippedItem.name}">${equippedItem.icon}</span>` : ""}</div><div class="profile-identity"><span class="eyebrow">NOME</span><h3>${escapeHtml(state.name)}</h3><p>${state.isMinor ? "Aluno menor de idade · responsável vinculado" : "Aluno · trilha iniciante"}</p><button class="button button-outline" type="button" data-screen="shop">Personalizar mascote <span aria-hidden="true">→</span></button></div><div class="profile-currency"><div><strong>${state.xp} XP</strong><span>Experiência</span></div><div><strong>${state.coins} ✦</strong><span>Moedas</span></div><div><strong>${state.unlockedItems.length}</strong><span>Itens liberados</span></div></div></section>
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

function renderSignup() {
  return `
    <section class="signup-layout"><div class="signup-intro"><p class="eyebrow">BEM-VINDE AO EDUSINAL</p><h2>Aprender Libras pode aproximar todo mundo.</h2><p>Escolha como quer participar. Esta tela demonstra os campos e as regras de cadastro.</p><div class="signup-aside"><span aria-hidden="true">✳</span><span>Cadastro e validação ainda não estão conectados ao banco de dados.</span></div></div><div class="signup-form-panel"><div class="signup-title"><span class="eyebrow">CRIAR PERFIL</span><h3>Como você quer participar?</h3></div><div class="role-options" role="group" aria-label="Escolha o tipo de perfil"><button class="role-option is-selected" type="button" data-role-choice="student"><span class="role-symbol">◉</span><strong>Aluno</strong><small>Aprender na trilha</small></button><button class="role-option" type="button" data-role-choice="guardian"><span class="role-symbol">⌂</span><strong>Responsável</strong><small>Acompanhar um aluno</small></button></div><form id="signup-form" novalidate><input type="hidden" id="selected-role" value="student"/><div class="form-grid"><label class="field-label" for="signup-name">Nome completo<input id="signup-name" name="name" autocomplete="name" placeholder="Seu nome" required /></label><label class="field-label" for="signup-email">E-mail<input id="signup-email" name="email" type="email" autocomplete="email" placeholder="voce@email.com" required /></label></div><fieldset class="age-fieldset" id="age-fieldset"><legend>Faixa etária do aluno</legend><label class="radio-line"><input type="radio" name="age" value="adult" checked /><span>18 anos ou mais</span></label><label class="radio-line"><input type="radio" name="age" value="minor" /><span>Menos de 18 anos</span></label></fieldset><div class="guardian-fields" id="student-link-fields" hidden><div class="guardian-heading"><span class="guardian-icon" aria-hidden="true">⌂</span><div><strong>Aluno acompanhado</strong><span>Informe o estudante vinculado a este responsável</span></div></div><div class="form-grid"><label class="field-label" for="student-name">Nome do aluno<input id="student-name" name="studentName" placeholder="Nome do aluno" /></label></div></div><div class="guardian-fields" id="guardian-fields" hidden><div class="guardian-heading"><span class="guardian-icon" aria-hidden="true">⌂</span><div><strong>Dados do responsável</strong><span>Obrigatórios para aluno menor de idade</span></div></div><div class="form-grid"><label class="field-label" for="guardian-name">Nome do responsável<input id="guardian-name" name="guardianName" autocomplete="name" placeholder="Nome completo" /></label><label class="field-label" for="guardian-email">E-mail do responsável<input id="guardian-email" name="guardianEmail" type="email" autocomplete="email" placeholder="responsavel@email.com" /></label></div></div><p class="form-error" id="form-error" role="alert"></p><button class="button button-primary button-full" type="submit">Criar perfil de demonstração <span aria-hidden="true">→</span></button><p class="form-legal">Ao continuar, você visualiza apenas um fluxo de protótipo. Nenhum dado será enviado.</p></form></div></section>`;
}

function renderLogin() {
  return `
    <section class="login-layout" aria-labelledby="login-title">
      <div class="signup-intro login-intro">
        <p class="eyebrow">BEM-VINDE DE VOLTA</p>
        <h2 id="login-title">Continue sua jornada no EduSinal.</h2>
        <p>Entre para acessar seu espaço de aprendizagem.</p>
        <button class="text-button" type="button" data-screen="intro"><span aria-hidden="true">←</span> Voltar ao início</button>
      </div>
      <div class="signup-form-panel login-panel">
        <div class="signup-title"><span class="eyebrow">ACESSO</span><h3>Entrar na sua conta</h3></div>
        <form id="login-form" novalidate>
          <label class="field-label" for="login-email">E-mail<input id="login-email" name="email" type="email" autocomplete="email" placeholder="voce@email.com" required /></label>
          <label class="field-label" for="login-password">Senha<input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Sua senha" required /></label>
          <p class="form-error" id="login-message" role="status" aria-live="polite"></p>
          <button class="button button-primary button-full" type="button" data-action="demo-login">Entrar <span aria-hidden="true">→</span></button>
        </form>
        <p class="form-legal">Protótipo demonstrativo: a autenticação ainda não está conectada. Não use uma senha real; ela não será salva nem enviada.</p>
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
  const screenButton = event.target.closest("[data-screen]");
  if (screenButton) {
    event.preventDefault();
    setScreen(screenButton.dataset.screen);
    return;
  }

  const roleButton = event.target.closest("[data-role-choice]");
  if (roleButton) {
    document.querySelectorAll(".role-option").forEach((item) => item.classList.toggle("is-selected", item === roleButton));
    document.getElementById("selected-role").value = roleButton.dataset.roleChoice;
    const ageFieldset = document.getElementById("age-fieldset");
    const guardianFields = document.getElementById("guardian-fields");
    const studentLinkFields = document.getElementById("student-link-fields");
    const isStudent = roleButton.dataset.roleChoice === "student";
    const isGuardian = roleButton.dataset.roleChoice === "guardian";
    ageFieldset.hidden = !isStudent;
    guardianFields.hidden = true;
    studentLinkFields.hidden = !isGuardian;
    return;
  }

  const actionButton = event.target.closest("[data-action], [data-shop-item]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === "demo-login") {
    document.getElementById("login-form").reset();
    document.getElementById("login-message").textContent = "A API de autenticação ainda não está disponível. Nenhum dado foi enviado.";
  } else if (actionButton.dataset.shopItem) {
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
        showToast("Atividade concluída: +20 XP");
      }
      persist();
    }
    setScreen("trail");
  }
});

document.addEventListener("change", (event) => {
  if (event.target.name === "age") {
    const isMinor = event.target.value === "minor";
    const guardianFields = document.getElementById("guardian-fields");
    guardianFields.hidden = !isMinor;
    guardianFields.querySelectorAll("input").forEach((input) => {
      input.required = isMinor;
    });
  }

  if (event.target.id === "theme-toggle") {
    state.theme = state.theme === "dark" ? "light" : "dark";
    persist();
    render();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "signup-form") {
    event.preventDefault();
    const form = event.target;
    const name = form.elements.name.value.trim();
    const role = document.getElementById("selected-role").value;
    const isMinor = role === "student" && form.elements.age.value === "minor";
    const linkedStudent = role === "guardian" ? form.elements.studentName.value.trim() : "";
    const error = document.getElementById("form-error");
    error.textContent = "";

    if (!name || !form.elements.email.value.trim()) {
      error.textContent = "Preencha nome e e-mail para continuar.";
      return;
    }
    if (isMinor && (!form.elements.guardianName.value.trim() || !form.elements.guardianEmail.value.trim())) {
      error.textContent = "Para aluno menor de idade, preencha os dados do responsável.";
      return;
    }
    if (role === "guardian" && !linkedStudent) {
      error.textContent = "Informe o aluno que este responsável acompanhará.";
      return;
    }

    state.name = name.split(" ")[0];
    state.role = role;
    state.isRegistered = true;
    state.isMinor = isMinor || role === "guardian";
    state.linkedStudent = isMinor ? name.split(" ")[0] : linkedStudent;
    persist();
    showToast("Perfil de demonstração criado neste navegador.");
    setScreen(role === "guardian" ? "family" : "trail");
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

render();