// TELAS DA TRILHA
// Apresentação, Home (trilha) e modo foco (árvore de lições).
// O conteúdo das etapas fica em conteudo.js e a atividade em licao.js.
// Cada função "render..." devolve o HTML de uma tela.

function renderIntro() {
  return `
    <section class="intro-screen" aria-labelledby="intro-title">
      <div class="intro-copy">
        <p class="eyebrow"><span class="status-dot"></span> APRENDIZAGEM VISUAL EM LIBRAS</p>
        <h2 id="intro-title">Aprender Libras é abrir espaço para novas conexões.</h2>
        <p>O EduSinal reúne uma trilha de aprendizagem, exercícios para praticar e um dicionário para consultar quando quiser.</p>
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
      <div><strong>Seguro para todas as idades</strong><span>Sem chat entre alunos e sem compras com dinheiro real.</span></div>
    </section>`;
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
    hint = `Liberada! Pode errar no máximo ${FINAL_MAX_MISTAKES}`;
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
      <div class="topic-topline"><button class="back-button" type="button" data-action="close-topic" id="topic-back" aria-label="Voltar à trilha"><span aria-hidden="true">←</span> <span class="back-label">Voltar à trilha</span></button><div class="topic-hud" aria-label="Seu progresso no jogo"><span class="hud-item hud-lives" aria-label="${state.lives} de ${MAX_LIVES} vidas"><span class="lives-hearts" aria-hidden="true">${hearts}</span><small>${timeUntilNextLife()}</small></span><span class="hud-item"><strong>${state.xp}</strong> XP</span><span class="hud-item"><strong>${state.coins}</strong> ✦</span><span class="hud-item"><strong>${state.streak}</strong> dias</span></div></div>
      ${state.lives === 0 ? `<p class="tree-warning" role="status"><span aria-hidden="true">♥</span> Sem vidas agora (${timeUntilNextLife()}). Enquanto isso, revise no <button class="text-button" type="button" data-screen="signs">dicionário</button> ou recarregue na <button class="text-button" type="button" data-screen="shop">lojinha</button>.</p>` : ""}
      <div class="tree-canvas">
        <svg class="tree-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines.join("")}</svg>
        ${renderFinalNode(topicId)}
        ${topic.branches.map((branch, index) => renderBranch(topicId, branch, index)).join("")}
      </div>
    </section>`;
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

// Etapas da trilha na Home. Só as que têm "topicId" já têm conteúdo.
const TRAIL_STEPS = [
  { topicId: "primeiros-sinais", number: "01", title: "Primeiros sinais", subtitle: "Saudações do dia a dia", color: "coral" },
  { topicId: "apresentacoes", number: "02", title: "Apresentações", subtitle: "Seu nome e novas conexões", color: "yellow" },
  { topicId: "pessoas-familia", number: "03", title: "Pessoas e família", subtitle: "Quem faz parte da sua vida", color: "green" },
  { topicId: null, number: "04", title: "Rotina e lugares", subtitle: "Palavras para o cotidiano", color: "blue" },
];

// Uma etapa da trilha com o estado real: começar, em andamento, concluída ou em breve.
function renderRouteStep(step) {
  if (!step.topicId) {
    return `<article class="route-step route-step-locked"><span class="route-node node-${step.color}" aria-label="Etapa ${step.number}, em breve">${step.number}</span><span class="path-label">EM BREVE</span><h3>${step.title}</h3><p>${step.subtitle}</p></article>`;
  }
  if (!isTopicUnlocked(step.topicId)) {
    const previous = TRAIL_STEPS[TRAIL_STEPS.indexOf(step) - 1];
    return `<article class="route-step route-step-locked"><span class="route-node node-${step.color}" aria-label="Etapa ${step.number}, bloqueada">🔒</span><span class="path-label">CONCLUA A ETAPA ${previous.number}</span><h3>${step.title}</h3><p>${step.subtitle}</p></article>`;
  }
  const done = doneBranchCount(step.topicId);
  const total = learningTopics[step.topicId].branches.length;
  const isFinished = isLessonDone(step.topicId, "final");
  let label = "COMECE POR AQUI";
  if (isFinished) label = "CONCLUÍDA ✓";
  else if (done > 0) label = `EM ANDAMENTO · ${done}/${total}`;
  return `<article class="route-step route-step-active${isFinished ? " is-finished" : ""}"><button class="route-node node-${step.color}" type="button" data-action="open-topic" data-topic="${step.topicId}" aria-label="Abrir ${step.title}">${isFinished ? "✓" : step.number}</button><span class="path-label">${label}</span><h3>${step.title}</h3><p>${step.subtitle}</p></article>`;
}

// Resumo das missões do dia na lateral da Home (o detalhe fica na aba Missões).
function renderHomeMission(mission) {
  const value = Math.min(mission.progress(), mission.target);
  let status = `${value} / ${mission.target}`;
  if (state.daily.claimed.includes(mission.id)) status = "Resgatada ✓";
  else if (isMissionComplete(mission)) status = `Pronta! Resgate +${mission.reward} ✦`;
  return `<button class="home-task" type="button" data-screen="missions"><span class="task-check" aria-hidden="true">${mission.icon}</span><span><strong>${mission.title}</strong><small>${status}</small></span><span aria-hidden="true">→</span></button>`;
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
          <button class="home-hero-art ${backdropClass()}" type="button" data-screen="mascot" aria-label="Personalizar seu mascote">${mascotSvg(state.mascot, "full", "")}<small>UM SINAL<br />DE CADA VEZ</small></button>
        </section>

        <section class="home-map" aria-labelledby="path-title">
          <div class="home-map-heading">
            <div><p class="eyebrow">NÍVEL INICIANTE</p><h2 id="path-title">Sua trilha</h2></div>
            <span class="section-count">UNIDADE 01 <span aria-hidden="true">·</span> ${TRAIL_STEPS.length} etapas</span>
          </div>
          <div class="learning-route">${TRAIL_STEPS.map(renderRouteStep).join("")}</div>
        </section>
      </div>

      <aside class="home-side-column" aria-label="Resumo e tarefas">
        <section class="home-side-card home-tasks">
          <div class="home-side-heading"><span class="panel-icon" aria-hidden="true">✦</span><h2>Missões do dia</h2></div>
          ${DAILY_MISSIONS.map(renderHomeMission).join("")}
        </section>

        <section class="home-side-card home-stats">
          <div class="home-side-heading"><span class="panel-icon" aria-hidden="true">◷</span><h2>Seu ritmo</h2></div>
          <div class="home-stat home-lives"><span>Vidas</span><div class="lives-summary"><div class="lives-hearts" aria-label="${state.lives} de ${MAX_LIVES} vidas">${hearts}</div><strong>${state.lives} / ${MAX_LIVES}</strong><small>${timeUntilNextLife()}</small></div></div>
          <div class="home-stat"><span>Ofensiva</span><strong>${state.streak} ${state.streak === 1 ? "dia" : "dias"}</strong></div>
          <div class="home-stat"><span>Experiência</span><strong>${state.xp} XP</strong></div>
          <div class="home-stat"><span>Meta de hoje</span><strong>${Math.min(state.daily.exercises, DAILY_GOAL)} / ${DAILY_GOAL} exercícios</strong></div>
          ${progressBarHtml(state.daily.exercises, DAILY_GOAL, "Progresso da meta diária")}
          <button class="text-button" type="button" data-screen="shop">Abrir a lojinha <span aria-hidden="true">→</span></button>
        </section>
      </aside>
    </div>
    <p class="demo-disclaimer">Pontos, sequência e conteúdo exibidos são dados demonstrativos deste protótipo.</p>`;
}

