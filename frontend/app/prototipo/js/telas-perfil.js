// PERFIL E CONFIGURAÇÕES
// Perfil: mascote, nome, números da jornada e conquistas.
// Configurações: preferências (tema, texto, animações), segurança, ajuda e conta.

// ----- Números da jornada -----

// Exercícios concluídos (sem contar as provas finais).
function exerciseCount() {
  return state.completedLessons.filter((key) => !key.endsWith(":final")).length;
}

// Etapas concluídas = provas finais feitas.
function finishedTopicsCount() {
  return state.completedLessons.filter((key) => key.endsWith(":final")).length;
}

// progress: função que diz quanto já foi feito; target: quanto precisa.
const ACHIEVEMENTS = [
  { id: "primeiro", icon: "hand-thumbs-up-fill", title: "Primeiro sinal", text: "Conclua seu primeiro exercício.", target: 1, progress: exerciseCount },
  { id: "cinco", icon: "pencil-square", title: "Mão na massa", text: "Conclua 5 exercícios.", target: 5, progress: exerciseCount },
  { id: "etapa", icon: "award-fill", title: "Etapa vencida", text: "Passe em uma prova final.", target: 1, progress: finishedTopicsCount },
  { id: "ofensiva", icon: "fire", title: "Em chamas", text: "Chegue a 7 dias de ofensiva.", target: 7, progress: () => state.streak },
  { id: "explorador", icon: "book-half", title: "Explorador", text: "Veja 10 sinais diferentes no dicionário.", target: 10, progress: () => state.signsSeen.length },
  { id: "colecionador", icon: "bag-heart-fill", title: "Colecionador", text: "Tenha 3 itens para o mascote (comprados ou ganhos).", target: 3, progress: () => state.unlockedItems.length },
  { id: "liga", icon: "trophy-fill", title: "Subindo", text: "Chegue à liga Prata.", target: 1, progress: () => state.league },
];

// ----- Ações do perfil -----

function saveName(form) {
  const name = form.elements.name.value.trim();
  if (name.length < 2 || name.length > 20) {
    showToast("O nome precisa ter de 2 a 20 caracteres.");
    return;
  }
  state.name = name;
  state.editingName = false;
  persist();
  render();
  showToast("Nome atualizado.");
}

function setEditingName(isEditing) {
  state.editingName = isEditing;
  render();
  if (isEditing) document.getElementById("profile-name-input").focus();
}

// ----- Ações de Configurações -----

function setTheme(theme) {
  state.theme = theme;
  persist();
  render();
}

function setTextSize(size) {
  state.textSize = size;
  persist();
  render();
}

function setMotion(motion) {
  state.motion = motion;
  persist();
  render();
}

// Apaga todo o progresso salvo neste navegador e recomeça do zero.
function resetDemo() {
  askConfirm({
    title: "Recomeçar a demonstração?",
    text: "Isso apaga XP, moedas, mascote e todo o progresso salvo neste navegador.",
    confirmLabel: "Apagar e recomeçar",
  }, () => {
    localStorage.removeItem("edusinal-prototype");
    location.href = location.pathname; // recarrega sem parâmetros na URL
  });
}

function logout() {
  state.isRegistered = false;
  persist();
  setScreen("intro");
  showToast("Você saiu. Seu progresso continua salvo neste navegador.");
}

// ----- Telas -----

function renderNameArea() {
  if (state.editingName) {
    return `
      <form class="name-form" id="profile-name-form">
        <label class="field-label" for="profile-name-input">Como quer ser chamado(a)?<input id="profile-name-input" name="name" value="${escapeHtml(state.name)}" maxlength="20" autocomplete="nickname" /></label>
        <div class="name-form-actions"><button class="button button-primary" type="submit">Salvar</button><button class="text-button" type="button" data-action="cancel-name">Cancelar</button></div>
      </form>`;
  }
  return `<span class="eyebrow">NOME</span><h3>${escapeHtml(state.name)} <button class="text-button name-edit" type="button" data-action="edit-name">Editar</button></h3>`;
}

function renderAchievement(achievement) {
  const value = Math.min(achievement.progress(), achievement.target);
  const isDone = value >= achievement.target;
  const footer = isDone ? `<small class="achievement-done">Conquistada ${icon("check-circle-fill")}</small>` : `${progressBarHtml(value, achievement.target, achievement.title)}<small>${value} / ${achievement.target}</small>`;
  return `<article class="achievement${isDone ? " is-done" : ""}"><span class="achievement-icon">${icon(achievement.icon)}</span><h3>${achievement.title}</h3><p>${achievement.text}</p>${footer}</article>`;
}

function renderProfile() {
  const doneCount = ACHIEVEMENTS.filter((achievement) => achievement.progress() >= achievement.target).length;
  const stats = [
    ["fire", `${state.streak} ${state.streak === 1 ? "dia" : "dias"}`, "Ofensiva"],
    ["trophy-fill", LEAGUES[state.league].name, "Liga atual"],
    ["pencil-square", exerciseCount(), "Exercícios"],
    ["award-fill", finishedTopicsCount(), "Etapas concluídas"],
    ["book-half", state.signsSeen.length, "Sinais vistos"],
    ["shield-fill-check", state.streakFreezes, "Protetores"],
  ];

  return `
    <section class="page-intro"><div><p class="eyebrow">SEU ESPAÇO</p><h2>Meu perfil</h2><p>Seu mascote, seus números e as conquistas da jornada.</p></div><span class="demo-pill">${state.isMinor ? "ALUNO MENOR DE IDADE" : "ALUNO"}</span></section>
    <section class="account-panel profile-avatar-panel">
      ${renderMascot()}
      <div class="profile-identity">${renderNameArea()}<p>Liga ${LEAGUES[state.league].name} · trilha iniciante</p><button class="button button-outline" type="button" data-screen="mascot">Personalizar mascote <i class="bi bi-arrow-right" aria-hidden="true"></i></button></div>
      <div class="profile-currency"><div><strong>${state.xp} XP</strong><span>Experiência</span></div><div><strong>${state.coins} ${icon("coin")}</strong><span>Moedas</span></div><div><strong>${state.unlockedItems.length}</strong><span>Itens</span></div></div>
    </section>
    <section class="profile-stats" aria-label="Números da jornada">${stats.map(([iconName, value, label]) => `<div class="profile-stat">${icon(iconName)}<strong>${value}</strong><small>${label}</small></div>`).join("")}</section>
    <section aria-labelledby="achievements-title">
      <div class="section-heading"><div><p class="eyebrow">${doneCount} DE ${ACHIEVEMENTS.length}</p><h2 id="achievements-title">Conquistas</h2></div></div>
      <div class="achievement-grid">${ACHIEVEMENTS.map(renderAchievement).join("")}</div>
    </section>
    <p class="demo-disclaimer">Este perfil é local e não representa uma conta autenticada.</p>`;
}

// Botões lado a lado para escolher uma opção (ex.: Claro | Escuro).
function renderChoice(action, current, options) {
  return `<div class="choice-group">${options.map(([value, label]) => `<button class="choice-button${current === value ? " is-active" : ""}" type="button" data-action="${action}" data-value="${value}" aria-pressed="${current === value}">${label}</button>`).join("")}</div>`;
}

function renderMore() {
  return `
    <section class="page-intro"><div><p class="eyebrow">EDUSINAL</p><h2>Configurações</h2><p>Preferências, privacidade, ajuda e conta.</p></div></section>
    <div class="more-sections">
      <details class="more-section" open>
        <summary><span class="more-icon"><i class="bi bi-sliders" aria-hidden="true"></i></span>Preferências</summary>
        <div class="setting-row"><div><strong>Tema</strong><small>Cores claras ou escuras.</small></div>${renderChoice("set-theme", state.theme, [["light", "Claro"], ["dark", "Escuro"]])}</div>
        <div class="setting-row"><div><strong>Tamanho do texto</strong><small>Deixa tudo um pouco maior.</small></div>${renderChoice("set-text-size", state.textSize, [["normal", "Normal"], ["large", "Grande"]])}</div>
        <div class="setting-row"><div><strong>Animações</strong><small>Reduz movimentos na tela.</small></div>${renderChoice("set-motion", state.motion, [["normal", "Ligadas"], ["reduced", "Reduzidas"]])}</div>
      </details>
      <details class="more-section">
        <summary><span class="more-icon"><i class="bi bi-shield-lock-fill" aria-hidden="true"></i></span>Segurança e privacidade</summary>
        <ul class="more-list">
          <li>Não existe chat nem mensagens entre alunos.</li>
          <li>Nas ligas aparecem só apelidos e avatares.</li>
          <li>Nesta demonstração, os dados ficam só neste navegador e não são enviados.</li>
          <li>Não há compras com dinheiro real: as moedas são do jogo.</li>
        </ul>
      </details>
      <details class="more-section">
        <summary><span class="more-icon"><i class="bi bi-question-circle" aria-hidden="true"></i></span>Ajuda</summary>
        <dl class="faq">
          <dt>Como funcionam as vidas?</dt><dd>Você tem ${MAX_LIVES} vidas. Cada resposta errada gasta uma, e uma vida volta a cada 30 minutos. O dicionário é livre.</dd>
          <dt>Como libero a prova final?</dt><dd>Conclua os 5 exercícios da árvore da etapa. A prova fica no centro da árvore.</dd>
          <dt>Como ganho moedas?</dt><dd>Concluindo exercícios novos e resgatando missões. Use as moedas na lojinha.</dd>
          <dt>O que é a ofensiva?</dt><dd>São os dias seguidos em que você praticou. Um protetor de ofensiva salva um dia perdido.</dd>
        </dl>
      </details>
      <details class="more-section">
        <summary><span class="more-icon"><i class="bi bi-info-circle" aria-hidden="true"></i></span>Sobre o EduSinal</summary>
        <p class="more-text">Plataforma para aprender Libras de forma visual e no seu ritmo, com trilha, exercícios e dicionário.</p>
        <a class="text-button" href="../../landing/index.html">Conhecer o projeto <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a>
      </details>
      <details class="more-section">
        <summary><span class="more-icon"><i class="bi bi-person-gear" aria-hidden="true"></i></span>Conta</summary>
        <div class="setting-row"><div><strong>Recomeçar demonstração</strong><small>Apaga XP, moedas e progresso deste navegador.</small></div><button class="button button-outline" type="button" data-action="reset-demo">Recomeçar</button></div>
        <div class="setting-row"><div><strong>Sair</strong><small>Volta para a tela de apresentação.</small></div><button class="button button-outline" type="button" data-action="logout">Sair</button></div>
      </details>
    </div>`;
}
