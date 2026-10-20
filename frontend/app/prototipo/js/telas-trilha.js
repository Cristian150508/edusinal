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

const learningTopics = {
  "primeiros-sinais": {
    number: "01",
    title: "Primeiros sinais",
    subtitle: "Saudações do dia a dia",
    study: [
      { icon: "A", label: "Alfabeto", hint: "Consulta livre, sem vidas", screen: "signs" },
      { icon: "👋", label: "Saudações", hint: "Oi, tchau e bom dia", screen: "signs" },
    ],
    practice: [
      { icon: "✳", label: "Desafio do dia", hint: "+20 XP · usa vidas", action: "start-lesson" },
      { icon: "⇄", label: "Combinar sinais", hint: "Em breve" },
    ],
  },
};

function renderTopicTree() {
  refreshLives();
  const hearts = livesHeartsHtml();
  const topic = learningTopics[state.focusTopic];
  const rows = [["study", 15, "ESTUDAR", "tree-study"], ["practice", 85, "PRATICAR", "tree-practice"]];
  const leaves = [];
  const lines = [];
  rows.forEach(([group, y, label, cls]) => {
    topic[group].forEach((leaf, index, list) => {
      const x = ((index + 0.5) / list.length) * 100;
      const ready = Boolean(leaf.screen || leaf.action);
      const attrs = leaf.screen ? `data-screen="${leaf.screen}"` : leaf.action ? `data-action="${leaf.action}"` : "";
      const livesOff = leaf.action === "start-lesson" && state.lives === 0;
      const body = `<span class="tree-icon" aria-hidden="true">${leaf.icon}</span><strong>${leaf.label}</strong><small>${leaf.hint}</small>`;
      leaves.push(ready
        ? `<button class="tree-leaf ${cls}" type="button" style="--x:${x}%;--y:${y}%;--i:${index}" ${attrs} ${livesOff ? "disabled" : ""}>${body}</button>`
        : `<div class="tree-leaf ${cls} is-locked" style="--x:${x}%;--y:${y}%;--i:${index}" aria-disabled="true">${body}</div>`);
      const mid = (50 + y) / 2;
      lines.push(`<path class="${ready ? "" : "is-locked"}" d="M50 50 C 50 ${mid}, ${x} ${mid}, ${x} ${y}" />`);
    });
  });
  return `
    <section class="topic-tree" aria-labelledby="topic-title">
      <div class="topic-topline"><button class="back-button" type="button" data-action="close-topic" id="topic-back"><span aria-hidden="true">←</span> Voltar à trilha</button><div class="topic-hud" aria-label="Seu progresso no jogo"><span class="hud-item hud-lives" aria-label="${state.lives} de ${MAX_LIVES} vidas"><span class="lives-hearts" aria-hidden="true">${hearts}</span><small>${timeUntilNextLife()}</small></span><span class="hud-item"><strong>${state.xp}</strong> XP</span><span class="hud-item"><strong>${state.coins}</strong> ✦</span><span class="hud-item"><strong>${state.streak}</strong> dias</span></div></div>
      <div class="tree-canvas">
        <svg class="tree-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines.join("")}</svg>
        <span class="tree-label tree-label-top">ESTUDAR</span>
        <span class="tree-label tree-label-bottom">PRATICAR</span>
        <div class="tree-center"><span class="route-node node-coral">${topic.number}</span><h2 id="topic-title">${topic.title}</h2><p>${topic.subtitle}</p></div>
        ${leaves.join("")}
      </div>
    </section>`;
}

function renderTrail() {
  if (state.focusTopic) return renderTopicTree();
  refreshLives();
  const hearts = livesHeartsHtml();
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
