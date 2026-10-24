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
          <button class="button button-primary" type="button" data-screen="signup">Criar minha conta <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
          <button class="text-button" type="button" data-screen="login">Já tenho cadastro <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
          <a class="quiet-link" href="../../landing/index.html">Conhecer o projeto <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a>
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

// ----- Árvore de exercícios (modo foco) -----
// Os exercícios seguem uma ordem: o 2 só abre depois do 1, e assim por diante.
// Computador: espiral de fora para dentro, com a prova final no centro.
// Celular: caminho ondulado de cima para baixo, só com os ícones; tocar num
// ícone abre um balão com o título e o botão para começar.

// Posições na espiral (computador), em % da área: 5 exercícios + a prova final.
const SPIRAL_POINTS = [
  { x: 12, y: 70 },
  { x: 22, y: 16 },
  { x: 78, y: 14 },
  { x: 88, y: 68 },
  { x: 58, y: 86 },
  { x: 48, y: 48 }, // prova final (centro)
];

// Posições no caminho ondulado (celular): x em % da largura, y em pixels.
const WAVE_POINTS = [
  { x: 50, y: 50 },
  { x: 74, y: 150 },
  { x: 50, y: 250 },
  { x: 26, y: 350 },
  { x: 50, y: 450 },
  { x: 50, y: 580 }, // prova final
];
const WAVE_HEIGHT = 690; // altura do caminho no celular, em pixels

// No celular, o primeiro toque mostra o balão; no computador, já começa.
function isMobileLayout() {
  return Boolean(window.matchMedia && window.matchMedia("(max-width: 760px)").matches);
}

// Um exercício abre quando o anterior estiver concluído (o primeiro já vem aberto).
function isBranchUnlocked(topicId, index) {
  const branches = learningTopics[topicId].branches;
  return index === 0 || isLessonDone(topicId, branches[index - 1].id);
}

// Curva suave passando por todos os pontos (para desenhar o caminho).
function smoothSegment(points, index) {
  const p0 = points[index - 1] || points[index];
  const p1 = points[index];
  const p2 = points[index + 1];
  const p3 = points[index + 2] || p2;
  const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
  const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
  const n = (value) => value.toFixed(1);
  return `M${n(p1.x)} ${n(p1.y)} C${n(c1.x)} ${n(c1.y)}, ${n(c2.x)} ${n(c2.y)}, ${n(p2.x)} ${n(p2.y)}`;
}

// O caminho é desenhado em pedaços: o pedaço depois de um exercício feito fica colorido.
function renderPath(topicId, points, viewBox, className) {
  const branches = learningTopics[topicId].branches;
  const segments = points.slice(0, -1).map((_, index) => {
    const isDone = isLessonDone(topicId, branches[index].id);
    return `<path class="${isDone ? "is-done" : ""}" d="${smoothSegment(points, index)}" />`;
  });
  return `<svg class="tree-lines ${className}" viewBox="${viewBox}" preserveAspectRatio="none" aria-hidden="true">${segments.join("")}</svg>`;
}

// Situação de um exercício: feito, aberto ou trancado.
function branchStatus(topicId, branch, index) {
  if (isLessonDone(topicId, branch.id)) return "done";
  return isBranchUnlocked(topicId, index) ? "open" : "locked";
}

function renderBranch(topicId, branch, index) {
  const status = branchStatus(topicId, branch, index);
  const spiral = SPIRAL_POINTS[index];
  const wave = WAVE_POINTS[index];
  const symbol = status === "done" ? icon("check-lg") : icon(branch.icon);
  let hint = `${branch.hint} · +${XP_PER_EXERCISE} XP`;
  if (status === "done") hint = "Concluído · refazer";
  if (status === "locked") hint = "Conclua o exercício anterior";
  const isSelected = state.selectedBranch === branch.id;
  return `<button class="tree-leaf is-${status}${isSelected ? " is-selected" : ""}" type="button" style="--x:${spiral.x}%;--y:${spiral.y}%;--mx:${wave.x}%;--my:${wave.y}px;--i:${index}" data-action="tap-branch" data-topic="${topicId}" data-branch="${branch.id}" aria-label="${index + 1}. ${branch.label}: ${hint}" aria-expanded="${isSelected}"><span class="tree-icon">${symbol}<span class="tree-order" aria-hidden="true">${status === "locked" ? icon("lock-fill") : index + 1}</span></span><strong>${branch.label}</strong><small>${hint}</small></button>`;
}

// Centro (computador) ou fim do caminho (celular): a prova final.
// Trancada ou concluída, tocar nela só leva de volta à trilha.
function finalNodeInfo(topicId) {
  const topic = learningTopics[topicId];
  const done = doneBranchCount(topicId);
  const total = topic.branches.length;
  if (isLessonDone(topicId, "final")) return { status: "done", symbol: icon("check-lg"), hint: "Etapa concluída · toque para voltar" };
  if (isFinalUnlocked(topicId)) return { status: "open", symbol: icon("star-fill"), hint: `Liberada! Pode errar no máximo ${FINAL_MAX_MISTAKES}` };
  return { status: "locked", symbol: icon("lock-fill"), hint: `Conclua os exercícios (${done} / ${total})` };
}

function renderFinalNode(topicId) {
  const topic = learningTopics[topicId];
  const info = finalNodeInfo(topicId);
  const spiral = SPIRAL_POINTS[SPIRAL_POINTS.length - 1];
  const wave = WAVE_POINTS[WAVE_POINTS.length - 1];
  const isSelected = state.selectedBranch === "final";
  return `<button class="tree-center is-${info.status}${info.status === "open" ? " is-open" : ""}${info.status === "done" ? " is-done" : ""}${isSelected ? " is-selected" : ""}" type="button" style="--x:${spiral.x}%;--y:${spiral.y}%;--mx:${wave.x}%;--my:${wave.y}px" data-action="tap-branch" data-topic="${topicId}" data-branch="final" aria-label="Prova final: ${info.hint}" aria-expanded="${isSelected}"><span class="route-node node-coral">${info.symbol}</span><h2 id="topic-title">Prova final</h2><p>${topic.title}</p><small>${info.hint}</small></button>`;
}

// Balão do celular: aparece embaixo do ícone tocado, com título e botão.
function renderBranchBubble(topicId) {
  const selected = state.selectedBranch;
  if (!selected) return "";
  const topic = learningTopics[topicId];
  let title;
  let text;
  let point;
  let action = "";

  if (selected === "final") {
    const info = finalNodeInfo(topicId);
    title = "Prova final";
    text = info.status === "locked" ? `Conclua os 5 exercícios para liberar (${doneBranchCount(topicId)} / 5).` : info.hint;
    point = WAVE_POINTS[WAVE_POINTS.length - 1];
    if (info.status === "open") action = `<button class="button button-primary" type="button" data-action="start-branch" data-topic="${topicId}" data-branch="final" ${state.lives === 0 ? "disabled" : ""}>Começar a prova ${icon("arrow-right")}</button>`;
    else action = `<button class="button button-outline" type="button" data-action="close-topic">Voltar à trilha</button>`;
  } else {
    const index = topic.branches.findIndex((branch) => branch.id === selected);
    const branch = topic.branches[index];
    const status = branchStatus(topicId, branch, index);
    title = `${index + 1}. ${branch.label}`;
    text = status === "locked" ? "Conclua o exercício anterior para liberar este." : `${branch.hint} · ${status === "done" ? "já concluído (revisão, sem XP)" : `+${XP_PER_EXERCISE} XP`}`;
    point = WAVE_POINTS[index];
    if (status !== "locked") action = `<button class="button button-primary" type="button" data-action="start-branch" data-topic="${topicId}" data-branch="${branch.id}" ${state.lives === 0 ? "disabled" : ""}>${status === "done" ? "Refazer" : "Começar"} ${icon("arrow-right")}</button>`;
  }
  return `<div class="tree-bubble${selected === "final" ? " is-above" : ""}" role="dialog" aria-label="${title}" style="--mx:${point.x}%;--my:${point.y}px"><strong>${title}</strong><p>${text}</p>${action}</div>`;
}

// Toque num exercício (ou na prova): no celular mostra o balão; no computador começa direto.
function tapBranch(topicId, branchId) {
  if (isMobileLayout()) {
    state.selectedBranch = state.selectedBranch === branchId ? null : branchId; // tocar de novo fecha
    render();
    return;
  }
  if (branchId === "final") {
    if (finalNodeInfo(topicId).status === "open") startBranch(topicId, "final");
    else closeTopic();
    return;
  }
  const index = learningTopics[topicId].branches.findIndex((branch) => branch.id === branchId);
  if (!isBranchUnlocked(topicId, index)) {
    showToast("Conclua o exercício anterior para liberar este.");
    return;
  }
  startBranch(topicId, branchId);
}

function renderTopicTree() {
  refreshLives();
  const hearts = livesHeartsHtml();
  const topicId = state.focusTopic;
  const topic = learningTopics[topicId];
  return `
    <section class="topic-tree" aria-labelledby="topic-title">
      <div class="topic-topline"><button class="back-button" type="button" data-action="close-topic" id="topic-back" aria-label="Voltar à trilha"><i class="bi bi-arrow-left" aria-hidden="true"></i> <span class="back-label">Voltar à trilha</span></button><div class="topic-hud" aria-label="Seu progresso no jogo"><span class="hud-item hud-lives" aria-label="${state.lives} de ${MAX_LIVES} vidas"><span class="lives-hearts" aria-hidden="true">${hearts}</span><small>${timeUntilNextLife()}</small></span><span class="hud-item hud-xp">${icon("lightning-charge-fill")}<strong>${state.xp}</strong> XP</span><span class="hud-item hud-coins">${icon("coin")}<strong>${state.coins}</strong></span><span class="hud-item hud-streak">${icon("fire")}<strong>${state.streak}</strong> dias</span></div></div>
      <div class="topic-heading"><p class="eyebrow">ETAPA ${topic.number}</p><h2>${topic.title}</h2></div>
      ${state.lives === 0 ? `<p class="tree-warning" role="status"><i class="bi bi-heart-fill" aria-hidden="true"></i> Sem vidas agora (${timeUntilNextLife()}). Enquanto isso, revise no <button class="text-button" type="button" data-screen="signs">dicionário</button> ou recarregue na <button class="text-button" type="button" data-screen="shop">lojinha</button>.</p>` : ""}
      <div class="tree-canvas" style="--wave-height:${WAVE_HEIGHT}px">
        ${renderPath(topicId, SPIRAL_POINTS, "0 0 100 100", "tree-lines-spiral")}
        ${renderPath(topicId, WAVE_POINTS, `0 0 100 ${WAVE_HEIGHT}`, "tree-lines-wave")}
        ${topic.branches.map((branch, index) => renderBranch(topicId, branch, index)).join("")}
        ${renderFinalNode(topicId)}
        ${renderBranchBubble(topicId)}
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
            <button class="button button-primary" type="button" data-action="open-topic" data-topic="${topicId}">${buttonLabel} <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
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
    return `<article class="route-step route-step-locked"><span class="route-node node-${step.color}" aria-label="Etapa ${step.number}, bloqueada"><i class="bi bi-lock-fill" aria-hidden="true"></i></span><span class="path-label">CONCLUA A ETAPA ${previous.number}</span><h3>${step.title}</h3><p>${step.subtitle}</p></article>`;
  }
  const done = doneBranchCount(step.topicId);
  const total = learningTopics[step.topicId].branches.length;
  const isFinished = isLessonDone(step.topicId, "final");
  let label = "COMECE POR AQUI";
  if (isFinished) label = "CONCLUÍDA";
  else if (done > 0) label = `EM ANDAMENTO · ${done}/${total}`;
  return `<article class="route-step route-step-active${isFinished ? " is-finished" : ""}"><button class="route-node node-${step.color}" type="button" data-action="open-topic" data-topic="${step.topicId}" aria-label="Abrir ${step.title}">${isFinished ? icon("check-lg") : step.number}</button><span class="path-label">${label}</span><h3>${step.title}</h3><p>${step.subtitle}</p></article>`;
}

// Resumo das missões do dia na lateral da Home (o detalhe fica na aba Missões).
function renderHomeMission(mission) {
  const value = Math.min(mission.progress(), mission.target);
  let status = `${value} / ${mission.target}`;
  if (state.daily.claimed.includes(mission.id)) status = `Resgatada ${icon("check-lg")}`;
  else if (isMissionComplete(mission)) status = `Pronta! Resgate +${mission.reward} ${icon("coin")}`;
  return `<button class="home-task" type="button" data-screen="missions"><span class="task-check">${icon(mission.icon)}</span><span><strong>${mission.title}</strong><small>${status}</small></span><i class="bi bi-arrow-right" aria-hidden="true"></i></button>`;
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
          <div class="home-side-heading"><span class="panel-icon"><i class="bi bi-bullseye" aria-hidden="true"></i></span><h2>Missões do dia</h2></div>
          ${DAILY_MISSIONS.map(renderHomeMission).join("")}
        </section>

        <section class="home-side-card home-stats">
          <div class="home-side-heading"><span class="panel-icon"><i class="bi bi-activity" aria-hidden="true"></i></span><h2>Seu ritmo</h2></div>
          <div class="home-stat home-lives"><span>Vidas</span><div class="lives-summary"><div class="lives-hearts" aria-label="${state.lives} de ${MAX_LIVES} vidas">${hearts}</div><strong>${state.lives} / ${MAX_LIVES}</strong><small>${timeUntilNextLife()}</small></div></div>
          <div class="home-stat"><span>Ofensiva</span><strong>${state.streak} ${state.streak === 1 ? "dia" : "dias"}</strong></div>
          <div class="home-stat"><span>Experiência</span><strong>${state.xp} XP</strong></div>
          <div class="home-stat"><span>Meta de hoje</span><strong>${Math.min(state.daily.exercises, DAILY_GOAL)} / ${DAILY_GOAL} exercícios</strong></div>
          ${progressBarHtml(state.daily.exercises, DAILY_GOAL, "Progresso da meta diária")}
          <button class="text-button" type="button" data-screen="shop">Abrir a lojinha <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
        </section>
      </aside>
    </div>
    <p class="demo-disclaimer">Pontos, sequência e conteúdo exibidos são dados demonstrativos deste protótipo.</p>`;
}

