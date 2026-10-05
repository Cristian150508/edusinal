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
  screen: requestedScreen === "cadastro" ? "signup" : requestedScreen === "home" ? "trail" : savedPrototype.role === "teacher" ? "teacherHome" : savedPrototype.role === "guardian" ? "family" : savedPrototype.role ? "trail" : "intro",
  theme: savedPrototype.theme || "light",
  xp: savedPrototype.xp || 120,
  streak: savedPrototype.streak || 4,
  name: savedPrototype.name || "Marina",
  role: savedPrototype.role || "student",
  isRegistered: Boolean(savedPrototype.role),
  isMinor: savedPrototype.isMinor || false,
  linkedStudent: savedPrototype.linkedStudent || "",
  answered: false,
  selectedTeacher: "camila",
  search: "",
};

const screenTitles = {
  intro: "Conheça o EduSinal",
  trail: "Minha trilha",
  signs: "Sinais",
  lesson: "Atividade do dia",
  leagues: "Ligas",
  missions: "Missões",
  teachers: "Professores particulares",
  teacherProfile: "Perfil do professor",
  booking: "Solicitar conversa",
  family: "Área do responsável",
  familyProgress: "Progresso do aluno",
  routine: "Rotina de estudos",
  guardianProfile: "Perfil do responsável",
  teacherHome: "Área do professor",
  teacherStudents: "Meus alunos",
  teacherActivities: "Atividades",
  teacherSchedule: "Agenda",
  teacherAccount: "Perfil profissional",
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
      ["teachers", "Professores", "◉"],
      ["profile", "Perfil", "●"],
      ["more", "Mais", "•••"],
    ],
  },
  teacher: {
    label: "ESPAÇO DO PROFESSOR",
    items: [
      ["teacherHome", "Visão geral", "⌂"],
      ["teacherStudents", "Meus alunos", "◉"],
      ["teacherActivities", "Atividades", "✳"],
      ["teacherSchedule", "Agenda", "▦"],
      ["teacherAccount", "Meu perfil", "●"],
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

const teachers = [
  { id: "camila", name: "Camila Souza", initials: "CS", detail: "Libras para iniciantes", method: "Online · individual", price: "R$ 55", color: "coral", available: "Hoje, 18h" },
  { id: "joao", name: "João Lima", initials: "JL", detail: "Conversação e cultura surda", method: "Online · individual", price: "R$ 65", color: "blue", available: "Amanhã, 10h" },
  { id: "marina", name: "Marina Alves", initials: "MA", detail: "Libras para crianças e famílias", method: "Online · individual", price: "R$ 60", color: "yellow", available: "Qui, 16h" },
];

function persist() {
  localStorage.setItem("edusinal-prototype", JSON.stringify({
    theme: state.theme,
    xp: state.xp,
    streak: state.streak,
    name: state.name,
    role: state.role,
    isRegistered: state.isRegistered,
    isMinor: state.isMinor,
    linkedStudent: state.linkedStudent,
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
        <p>O EduSinal reúne uma trilha de aprendizagem, atividades para praticar e acompanhamento para alunos, famílias e professores.</p>
        <div class="intro-actions">
          <button class="button button-primary" type="button" data-screen="signup">Criar minha conta <span aria-hidden="true">→</span></button>
          <a class="quiet-link" href="../../landing/index.html">Conhecer o projeto <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="intro-art"><img src="../../assets/images/Mascote%20Libras%20em%20Azul%20vibrante.png" alt="Mascote do EduSinal" /></div>
    </section>
    <section class="intro-points" aria-label="Sobre o EduSinal">
      <div><strong>Aprenda no seu ritmo</strong><span>Uma trilha visual com etapas para praticar.</span></div>
      <div><strong>Acompanhe seu caminho</strong><span>Veja atividades e progresso em um só lugar.</span></div>
      <div><strong>Conecte diferentes perfis</strong><span>Espaços pensados para alunos, famílias e professores.</span></div>
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
          <button class="text-button" type="button" data-screen="teachers">Encontrar professor <span aria-hidden="true">→</span></button>
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

function renderTeachers() {
  const query = state.search.trim().toLocaleLowerCase("pt-BR");
  const filtered = teachers.filter((teacher) => `${teacher.name} ${teacher.detail}`.toLocaleLowerCase("pt-BR").includes(query));
  return `
    <section class="page-intro"><div><p class="eyebrow">APRENDIZADO COM ACOMPANHAMENTO</p><h2>Encontre seu professor</h2><p>Explore perfis de demonstração e veja como poderia funcionar a busca por aulas particulares.</p></div><span class="demo-pill">PERFIS FICTÍCIOS</span></section>
    <section class="teacher-tools" aria-label="Buscar professor"><label class="search-box"><span aria-hidden="true">⌕</span><input id="teacher-search" type="search" placeholder="Buscar por nome ou especialidade" value="${escapeHtml(state.search)}" /></label><label class="select-box">Formato<select aria-label="Formato da aula"><option>Todos</option><option>Online</option><option>Presencial</option></select></label></section>
    <section class="teacher-results" aria-label="Professores disponíveis">${filtered.length ? filtered.map((teacher) => `
      <article class="teacher-card">
        <div class="teacher-avatar avatar-${teacher.color}" aria-hidden="true">${teacher.initials}</div>
        <div class="teacher-info"><span class="teacher-availability"><span class="status-dot"></span> Disponível · ${teacher.available}</span><h3>${teacher.name}</h3><p>${teacher.detail}</p><span class="teacher-method">${teacher.method}</span></div>
        <div class="teacher-price"><strong>${teacher.price}</strong><span>por aula</span><button class="button button-small button-outline" type="button" data-action="view-teacher" data-teacher="${teacher.id}">Ver perfil</button></div>
      </article>`).join("") : `<p class="empty-state">Não encontramos perfis com esse termo.</p>`}</section>
    <p class="demo-disclaimer">Nomes, horários e valores são fictícios. Nenhuma aula é contratada neste protótipo.</p>`;
}

function renderTeacherProfile() {
  const teacher = teachers.find((item) => item.id === state.selectedTeacher) || teachers[0];
  return `
    <section class="profile-layout">
      <div class="profile-main">
        <button class="back-button" type="button" data-screen="teachers"><span aria-hidden="true">←</span> Todos os professores</button>
        <article class="profile-header"><div class="teacher-avatar avatar-${teacher.color} avatar-large" aria-hidden="true">${teacher.initials}</div><div><span class="teacher-availability"><span class="status-dot"></span> Disponível · ${teacher.available}</span><h2>${teacher.name}</h2><p>${teacher.detail}</p><span class="teacher-method">${teacher.method}</span></div></article>
        <div class="profile-section"><p class="eyebrow">SOBRE AS AULAS</p><h3>Aprenda com acompanhamento individual</h3><p>Este espaço pode apresentar a experiência, a metodologia e os horários de cada professor. As informações aqui são apenas uma prévia de interface.</p></div>
        <div class="profile-section"><p class="eyebrow">ESPECIALIDADES</p><div class="tag-list"><span>Iniciantes</span><span>Conversação</span><span>Cultura surda</span></div></div>
      </div>
      <aside class="booking-panel"><span class="eyebrow">AULA PARTICULAR</span><div class="booking-price"><strong>${teacher.price}</strong><span>/ aula</span></div><p>Formato: online e individual</p><button class="button button-primary button-full" type="button" data-screen="booking">Ver horários <span aria-hidden="true">→</span></button><span class="booking-note">Agendamento ilustrativo</span></aside>
    </section>
    <p class="demo-disclaimer">Perfil e condições de aula fictícios; sem contratação ou contato real.</p>`;
}

function renderBooking() {
  const teacher = teachers.find((item) => item.id === state.selectedTeacher) || teachers[0];
  return `
    <section class="booking-content"><button class="back-button" type="button" data-screen="teacherProfile"><span aria-hidden="true">←</span> Voltar ao perfil</button><div class="booking-form-wrap"><p class="eyebrow">PRÓXIMO PASSO</p><h2>Converse com ${teacher.name}</h2><p>Escolha uma opção para visualizar o fluxo de solicitação.</p><form id="booking-form"><fieldset class="choice-fieldset"><legend>Horários disponíveis</legend><label class="time-choice"><input type="radio" name="time" value="${teacher.available}" checked /><span>${teacher.available}</span></label><label class="time-choice"><input type="radio" name="time" value="Sexta, 14h" /><span>Sexta, 14h</span></label></fieldset><label class="field-label" for="booking-message">Mensagem <span>opcional</span></label><textarea id="booking-message" rows="3" placeholder="Conte um pouco sobre seu objetivo"></textarea><button class="button button-primary button-full" type="submit">Solicitar conversa <span aria-hidden="true">→</span></button></form><p class="demo-disclaimer">A solicitação não será enviada; este fluxo é apenas demonstrativo.</p></div></section>`;
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
    teacherProfile: "teachers",
    booking: "teachers",
    familyProgress: "familyProgress",
  };
  const activeScreen = activeScreens[state.screen] || state.screen;
  document.getElementById("sidebar-label").textContent = config.label;
  document.getElementById("side-nav").innerHTML = config.items.map(([screen, label, icon], index) => `
    <button class="nav-item${activeScreen === screen ? " is-active" : ""}" type="button" data-screen="${screen}"${activeScreen === screen ? ' aria-current="page"' : ""}>
      <span class="nav-icon nav-icon-${index + 1}" aria-hidden="true">${icon}</span><span>${label}</span>
    </button>`).join("");
  document.getElementById("signup-entry").hidden = state.isRegistered;
  document.getElementById("player-stats").hidden = state.role !== "student";
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
  return `
    <section class="page-intro"><div><p class="eyebrow">SEU ESPAÇO</p><h2>Perfil de aluno</h2><p>Resumo do perfil de demonstração usado nesta prévia.</p></div><span class="demo-pill">ALUNO</span></section>
    <section class="account-panel"><span class="student-avatar">${escapeHtml(state.name.slice(0, 1).toUpperCase())}</span><div><span class="eyebrow">NOME</span><h3>${escapeHtml(state.name)}</h3><p>${state.isMinor ? "Aluno menor de idade · responsável vinculado" : "Aluno · trilha iniciante"}</p></div><div class="account-stat"><strong>${state.xp} XP</strong><span>Experiência demonstrativa</span></div></section>
    <p class="demo-disclaimer">Este perfil é local e não representa uma conta autenticada.</p>`;
}

function renderMore() {
  return `
    <section class="page-intro"><div><p class="eyebrow">EDUSINAL</p><h2>Mais opções</h2><p>Acesse outras áreas da plataforma.</p></div></section>
    <section class="more-links"><a href="#sinais" data-screen="signs"><span class="more-link-icon">▤</span><span><strong>Explorar sinais</strong><small>Acesse a biblioteca visual</small></span><span aria-hidden="true">→</span></a><a href="../../landing/index.html"><span class="more-link-icon">◉</span><span><strong>Página inicial</strong><small>Volte à apresentação do EduSinal</small></span><span aria-hidden="true">↗</span></a></section>`;
}

function renderTeacherHome() {
  return `
    <section class="page-intro"><div><p class="eyebrow">ESPAÇO DO EDUCADOR</p><h2>Olá, ${escapeHtml(state.name)}.</h2><p>Uma visão inicial para organizar seu perfil e acompanhar alunos.</p></div><span class="demo-pill">PERFIL PROFESSOR</span></section>
    <section class="teacher-dashboard-grid"><article class="teacher-dashboard-main"><p class="eyebrow">SEU PERFIL</p><h3>Apresente seu trabalho</h3><p>Adicione sua experiência, especialidades e disponibilidade para aparecer na busca de professores.</p><button class="button button-primary" type="button" data-action="edit-teacher">Editar perfil <span aria-hidden="true">→</span></button></article><article class="teacher-dashboard-stat"><span class="metric-mark">◉</span><div><strong>0</strong><span>Alunos acompanhados</span></div></article><article class="teacher-dashboard-stat"><span class="metric-mark">◷</span><div><strong>0</strong><span>Aulas agendadas</span></div></article></section>
    <section class="empty-teacher-state"><span class="empty-icon" aria-hidden="true">✳</span><div><h3>Seu espaço começa por aqui</h3><p>Quando o cadastro estiver conectado ao sistema, você poderá configurar aulas e acompanhar solicitações.</p></div></section>
    <p class="demo-disclaimer">Nenhum perfil profissional ou agendamento é publicado neste protótipo.</p>`;
}

function renderTeacherSection(title, label, description, actionScreen) {
  return `
    <section class="page-intro"><div><p class="eyebrow">ESPAÇO DO PROFESSOR</p><h2>${title}</h2><p>${description}</p></div><span class="demo-pill">VISÃO DEMONSTRATIVA</span></section>
    <section class="empty-teacher-state"><span class="empty-icon" aria-hidden="true">✳</span><div><h3>${label}</h3><p>Esta área ficará vinculada ao perfil de professor quando o cadastro e os dados estiverem integrados.</p></div></section>
    ${actionScreen ? `<button class="text-button" type="button" data-screen="${actionScreen}">Voltar à visão geral <span aria-hidden="true">→</span></button>` : ""}`;
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
    <section class="signup-layout"><div class="signup-intro"><p class="eyebrow">BEM-VINDE AO EDUSINAL</p><h2>Aprender Libras pode aproximar todo mundo.</h2><p>Escolha como quer participar. Esta tela demonstra os campos e as regras de cadastro.</p><div class="signup-aside"><span aria-hidden="true">✳</span><span>Cadastro e validação ainda não estão conectados ao banco de dados.</span></div></div><div class="signup-form-panel"><div class="signup-title"><span class="eyebrow">CRIAR PERFIL</span><h3>Como você quer participar?</h3></div><div class="role-options" role="group" aria-label="Escolha o tipo de perfil"><button class="role-option is-selected" type="button" data-role-choice="student"><span class="role-symbol">◉</span><strong>Aluno</strong><small>Aprender na trilha</small></button><button class="role-option" type="button" data-role-choice="teacher"><span class="role-symbol">✎</span><strong>Professor</strong><small>Ensinar Libras</small></button><button class="role-option" type="button" data-role-choice="guardian"><span class="role-symbol">⌂</span><strong>Responsável</strong><small>Acompanhar um aluno</small></button></div><form id="signup-form" novalidate><input type="hidden" id="selected-role" value="student"/><div class="form-grid"><label class="field-label" for="signup-name">Nome completo<input id="signup-name" name="name" autocomplete="name" placeholder="Seu nome" required /></label><label class="field-label" for="signup-email">E-mail<input id="signup-email" name="email" type="email" autocomplete="email" placeholder="voce@email.com" required /></label></div><fieldset class="age-fieldset" id="age-fieldset"><legend>Faixa etária do aluno</legend><label class="radio-line"><input type="radio" name="age" value="adult" checked /><span>18 anos ou mais</span></label><label class="radio-line"><input type="radio" name="age" value="minor" /><span>Menos de 18 anos</span></label></fieldset><div class="guardian-fields" id="student-link-fields" hidden><div class="guardian-heading"><span class="guardian-icon" aria-hidden="true">⌂</span><div><strong>Aluno acompanhado</strong><span>Informe o estudante vinculado a este responsável</span></div></div><div class="form-grid"><label class="field-label" for="student-name">Nome do aluno<input id="student-name" name="studentName" placeholder="Nome do aluno" /></label></div></div><div class="guardian-fields" id="guardian-fields" hidden><div class="guardian-heading"><span class="guardian-icon" aria-hidden="true">⌂</span><div><strong>Dados do responsável</strong><span>Obrigatórios para aluno menor de idade</span></div></div><div class="form-grid"><label class="field-label" for="guardian-name">Nome do responsável<input id="guardian-name" name="guardianName" autocomplete="name" placeholder="Nome completo" /></label><label class="field-label" for="guardian-email">E-mail do responsável<input id="guardian-email" name="guardianEmail" type="email" autocomplete="email" placeholder="responsavel@email.com" /></label></div></div><p class="form-error" id="form-error" role="alert"></p><button class="button button-primary button-full" type="submit">Criar perfil de demonstração <span aria-hidden="true">→</span></button><p class="form-legal">Ao continuar, você visualiza apenas um fluxo de protótipo. Nenhum dado será enviado.</p></form></div></section>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function render() {
  const renderers = {
    intro: renderIntro,
    trail: renderTrail,
    signs: renderSigns,
    lesson: renderLesson,
    leagues: renderLeagues,
    missions: renderMissions,
    teachers: renderTeachers,
    teacherProfile: renderTeacherProfile,
    booking: renderBooking,
    family: renderFamily,
    familyProgress: renderFamily,
    routine: renderRoutine,
    guardianProfile: renderGuardianProfile,
    teacherHome: renderTeacherHome,
    teacherStudents: () => renderTeacherSection("Meus alunos", "Nenhum aluno vinculado ainda", "Acompanhe as pessoas que estudam com você.", "teacherHome"),
    teacherActivities: () => renderTeacherSection("Atividades", "Organize sua primeira atividade", "Crie e acompanhe materiais para suas turmas.", "teacherHome"),
    teacherSchedule: () => renderTeacherSection("Agenda", "Sua agenda está livre", "Horários e solicitações de aula aparecerão aqui.", "teacherHome"),
    teacherAccount: () => renderTeacherSection("Meu perfil", "Apresente sua experiência", "Configure especialidades e disponibilidade para aulas particulares.", "teacherHome"),
    profile: renderProfile,
    more: renderMore,
    signup: renderSignup,
  };
  heading.textContent = screenTitles[state.screen] || "EduSinal";
  app.dataset.screen = state.screen;
  renderNavigation();
  screenRoot.innerHTML = renderers[state.screen]();
  document.getElementById("xp-value").textContent = state.xp;
  document.getElementById("streak-value").textContent = state.streak;
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

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === "start-lesson") {
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
      state.xp += 20;
      persist();
      showToast("Atividade concluída: +20 XP");
    }
    setScreen("trail");
  } else if (action === "view-teacher") {
    state.selectedTeacher = actionButton.dataset.teacher;
    setScreen("teacherProfile");
  } else if (action === "edit-teacher") {
    setScreen("teacherAccount");
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

document.addEventListener("input", (event) => {
  if (event.target.id === "teacher-search") {
    const cursor = event.target.selectionStart;
    state.search = event.target.value;
    render();
    const search = document.getElementById("teacher-search");
    search.focus();
    search.setSelectionRange(cursor, cursor);
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
    setScreen(role === "teacher" ? "teacherHome" : role === "guardian" ? "family" : "trail");
  }

  if (event.target.id === "booking-form") {
    event.preventDefault();
    showToast("Solicitação demonstrativa concluída; nada foi enviado.");
    setScreen("teachers");
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