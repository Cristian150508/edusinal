// TELAS DA TRILHA
// Apresentação, Home (trilha), modo foco (árvore de lições) e atividade.
// Cada função "render..." devolve o HTML de uma tela.

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

// ----- Etapas do modo foco -----
// Cada etapa tem 5 galhos (exercícios) e uma prova final no centro.
// Por enquanto todos os galhos usam a mesma atividade de demonstração.
const learningTopics = {
  "primeiros-sinais": {
    number: "01",
    title: "Primeiros sinais",
    subtitle: "Saudações do dia a dia",
    branches: [
      { id: "alfabeto", icon: "A", label: "Alfabeto", hint: "Letras em Libras" },
      { id: "oi-tchau", icon: "👋", label: "Oi e tchau", hint: "Cumprimentos" },
      { id: "bom-dia", icon: "☀", label: "Bom dia", hint: "Saudações do dia" },
      { id: "por-favor", icon: "✋", label: "Por favor", hint: "Gentileza" },
      { id: "obrigado", icon: "♥", label: "Obrigado(a)", hint: "Agradecer" },
    ],
  },
};

// ----- Progresso das lições (salvo no navegador) -----

function lessonKey(topicId, branchId) {
  return `${topicId}:${branchId}`;
}

function isLessonDone(topicId, branchId) {
  return state.completedLessons.includes(lessonKey(topicId, branchId));
}

// Quantos dos 5 galhos desta etapa já foram concluídos.
function doneBranchCount(topicId) {
  return learningTopics[topicId].branches.filter((branch) => isLessonDone(topicId, branch.id)).length;
}

// A prova final só abre quando todos os galhos estão concluídos.
function isFinalUnlocked(topicId) {
  return doneBranchCount(topicId) === learningTopics[topicId].branches.length;
}

// Marca a lição como concluída. Devolve true se foi a primeira vez.
function markLessonDone(topicId, branchId) {
  if (isLessonDone(topicId, branchId)) return false;
  state.completedLessons.push(lessonKey(topicId, branchId));
  persist();
  return true;
}

// ----- Árvore -----

// Os 5 galhos ficam em volta do centro, como um pentágono (ângulos em graus).
const BRANCH_ANGLES = [-90, -18, 54, 126, 198];
const TREE_RADIUS_X = 36; // % da largura
const TREE_RADIUS_Y = 34; // % da altura

function branchPosition(index) {
  const radians = (BRANCH_ANGLES[index] * Math.PI) / 180;
  return {
    x: 50 + TREE_RADIUS_X * Math.cos(radians),
    y: 50 + TREE_RADIUS_Y * Math.sin(radians),
  };
}

function renderBranch(topicId, branch, index) {
  const { x, y } = branchPosition(index);
  const isDone = isLessonDone(topicId, branch.id);
  const icon = isDone ? "✓" : branch.icon;
  const hint = isDone ? "Concluído · refazer" : `${branch.hint} · +20 XP`;
  return `<button class="tree-leaf${isDone ? " is-done" : ""}" type="button" style="--x:${x}%;--y:${y}%;--i:${index}" data-action="start-branch" data-topic="${topicId}" data-branch="${branch.id}" ${state.lives === 0 ? "disabled" : ""}><span class="tree-icon" aria-hidden="true">${icon}</span><strong>${branch.label}</strong><small>${hint}</small></button>`;
}

// O centro é a prova final. Trancada ou concluída, ele só leva de volta à trilha.
function renderFinalNode(topicId) {
  const topic = learningTopics[topicId];
  const done = doneBranchCount(topicId);
  const total = topic.branches.length;
  const isFinalDone = isLessonDone(topicId, "final");
  const isOpen = isFinalUnlocked(topicId) && !isFinalDone;

  let icon = "🔒";
  let hint = `Conclua os galhos (${done} / ${total}) · toque para voltar`;
  if (isFinalDone) {
    icon = "✓";
    hint = "Etapa concluída · toque para voltar";
  } else if (isOpen) {
    icon = "★";
    hint = "Liberada! Toque para começar";
  }
  const attrs = isOpen ? `data-action="start-branch" data-topic="${topicId}" data-branch="final"` : 'data-action="close-topic"';
  const disabled = isOpen && state.lives === 0 ? "disabled" : "";
  return `<button class="tree-center${isOpen ? " is-open" : ""}${isFinalDone ? " is-done" : ""}" type="button" ${attrs} ${disabled}><span class="route-node node-coral" aria-hidden="true">${icon}</span><h2 id="topic-title">Prova final</h2><p>${topic.title}</p><small>${hint}</small></button>`;
}

function renderTopicTree() {
  refreshLives();
  const hearts = livesHeartsHtml();
  const topicId = state.focusTopic;
  const topic = learningTopics[topicId];
  const lines = topic.branches.map((branch, index) => {
    const { x, y } = branchPosition(index);
    return `<path class="${isLessonDone(topicId, branch.id) ? "is-done" : ""}" d="M50 50 L ${x} ${y}" />`;
  });
  return `
    <section class="topic-tree" aria-labelledby="topic-title">
      <div class="topic-topline"><button class="back-button" type="button" data-action="close-topic" id="topic-back"><span aria-hidden="true">←</span> Voltar à trilha</button><div class="topic-hud" aria-label="Seu progresso no jogo"><span class="hud-item hud-lives" aria-label="${state.lives} de ${MAX_LIVES} vidas"><span class="lives-hearts" aria-hidden="true">${hearts}</span><small>${timeUntilNextLife()}</small></span><span class="hud-item"><strong>${state.xp}</strong> XP</span><span class="hud-item"><strong>${state.coins}</strong> ✦</span><span class="hud-item"><strong>${state.streak}</strong> dias</span></div></div>
      <div class="tree-canvas">
        <svg class="tree-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines.join("")}</svg>
        ${renderFinalNode(topicId)}
        ${topic.branches.map((branch, index) => renderBranch(topicId, branch, index)).join("")}
      </div>
    </section>`;
}


// Etapa em que o aluno está: a primeira cuja prova final ainda não foi feita.
function currentTopicId() {
  const topicIds = Object.keys(learningTopics);
  return topicIds.find((id) => !isLessonDone(id, "final")) || topicIds[topicIds.length - 1];
}

// Texto do aviso "você está aqui" no topo da Home.
function renderHeroProgress() {
  const topicId = currentTopicId();
  const topic = learningTopics[topicId];
  const done = doneBranchCount(topicId);
  const total = topic.branches.length;

  let summary = `${done} de ${total} exercícios concluídos.`;
  let buttonLabel = done === 0 ? "Começar a etapa" : "Continuar de onde parou";
  if (isLessonDone(topicId, "final")) {
    summary = "Etapa concluída, parabéns!";
    buttonLabel = "Rever a etapa";
  } else if (done === total) {
    summary = "Todos os exercícios feitos. A prova final está liberada!";
    buttonLabel = "Ir para a prova final";
  }
  return `
          <div class="home-hero-copy">
            <p class="eyebrow"><span class="status-dot"></span> VOCÊ ESTÁ AQUI · ETAPA ${topic.number}</p>
            <h2>Oi, ${escapeHtml(state.name)}! <span>${topic.title}</span></h2>
            <p>${topic.subtitle}. ${summary}</p>
            <button class="button button-primary" type="button" data-action="open-topic" data-topic="${topicId}">${buttonLabel} <span aria-hidden="true">→</span></button>
          </div>`;
}

function renderTrail() {
  if (state.focusTopic) return renderTopicTree();
  refreshLives();
  const hearts = livesHeartsHtml();
  return `
    <div class="home-dashboard">
      <div class="home-main-column">
        <section class="home-hero">
${renderHeroProgress()}
          <div class="home-hero-art" aria-hidden="true"><span>🤟</span><small>UM SINAL<br />DE CADA VEZ</small></div>
        </section>

        <section class="home-map" aria-labelledby="path-title">
          <div class="home-map-heading">
            <div><p class="eyebrow">NÍVEL INICIANTE</p><h2 id="path-title">Sua trilha</h2></div>
            <span class="section-count">UNIDADE 01 <span aria-hidden="true">·</span> 4 etapas</span>
          </div>
          <div class="learning-route">
            <article class="route-step route-step-active"><button class="route-node node-coral" type="button" data-action="open-topic" data-topic="primeiros-sinais" aria-label="Abrir Primeiros sinais">01</button><span class="path-label">COMECE POR AQUI</span><h3>Primeiros sinais</h3><p>Saudações do dia a dia</p></article>
            <article class="route-step route-step-locked"><span class="route-node node-yellow" aria-label="Etapa bloqueada">02</span><span class="path-label">PRÓXIMA ETAPA</span><h3>Apresentações</h3><p>Seu nome e novas conexões</p></article>
            <article class="route-step route-step-locked"><span class="route-node node-green" aria-label="Etapa bloqueada">03</span><span class="path-label">EM SEGUIDA</span><h3>Pessoas e família</h3><p>Quem faz parte da sua vida</p></article>
            <article class="route-step route-step-locked"><span class="route-node node-blue" aria-label="Etapa bloqueada">04</span><span class="path-label">EM SEGUIDA</span><h3>Rotina e lugares</h3><p>Palavras para o cotidiano</p></article>
          </div>
        </section>
      </div>

      <aside class="home-side-column" aria-label="Resumo e tarefas">
        <section class="home-side-card home-tasks">
          <div class="home-side-heading"><span class="panel-icon" aria-hidden="true">✦</span><h2>Tarefas</h2></div>
          <button class="home-task" type="button" data-action="open-topic" data-topic="${currentTopicId()}"><span class="task-check">01</span><span><strong>Continue sua etapa</strong><small>Faça um exercício da árvore</small></span><span aria-hidden="true">→</span></button>
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
