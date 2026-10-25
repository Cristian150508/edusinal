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
        <div class="name-form-actions"><button class="button-3d button-3d-light" type="submit">Salvar</button><button class="text-button" type="button" data-action="cancel-name">Cancelar</button></div>
      </form>`;
  }
  return `<h2 id="profile-title">${escapeHtml(state.name)} <button class="profile-name-edit" type="button" data-action="edit-name" aria-label="Editar nome" title="Editar nome">${icon("pencil-fill")}</button></h2>`;
}

// Item do mascote que a conquista dá de prêmio (se der algum).
function achievementPrize(achievement) {
  return MASCOT_ITEMS.find((item) => item.unlock.type === "achievement" && item.unlock.id === achievement.id);
}

// Conquista: uma medalha (dourada quando conquistada) e a barra de progresso.
function renderAchievement(achievement) {
  const value = Math.min(achievement.progress(), achievement.target);
  const isDone = value >= achievement.target;
  const prize = achievementPrize(achievement);
  const percent = Math.round((value / achievement.target) * 100);
  const footer = isDone
    ? `<span class="badge-done">${icon("check-circle-fill")} Conquistada</span>`
    : `<div class="mission-progress"><div class="mission-bar" role="progressbar" aria-label="${achievement.title}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${achievement.target}"><span style="width: ${percent}%"></span></div><strong>${value} / ${achievement.target}</strong></div>`;
  return `
    <article class="badge-card${isDone ? " is-done" : ""}">
      <span class="badge-medal">${icon(achievement.icon)}</span>
      <div class="badge-info">
        <h3>${achievement.title}</h3>
        <p>${achievement.text}</p>
        ${prize ? `<small class="badge-prize">${icon("gift-fill")} Prêmio: ${prize.name}</small>` : ""}
        ${footer}
      </div>
    </article>`;
}

// Quadradinho de número: ícone colorido, valor e nome.
function renderProfileTile([iconName, value, label, color]) {
  const content = `<span class="profile-tile-icon is-${color}">${icon(iconName)}</span><span><strong>${value}</strong><small>${label}</small></span>`;
  // a ofensiva abre o calendário dos dias praticados
  if (iconName === "fire") return `<button class="profile-tile is-button" type="button" data-action="open-streak" aria-label="Ofensiva: ${value} ${label}. Abrir calendário">${content}</button>`;
  return `<div class="profile-tile">${content}</div>`;
}

function renderProfile() {
  const doneCount = ACHIEVEMENTS.filter((achievement) => achievement.progress() >= achievement.target).length;
  const items = mascotItemsCount();
  const tiles = [
    ["fire", state.streak, state.streak === 1 ? "dia de ofensiva" : "dias de ofensiva", "coral"],
    ["lightning-charge-fill", state.xp, "XP total", "yellow"],
    ["trophy-fill", LEAGUES[state.league].name, "Liga atual", "blue"],
    ["coin", state.coins, "Moedas", "yellow"],
    ["pencil-square", exerciseCount(), "Exercícios", "blue"],
    ["award-fill", finishedTopicsCount(), "Etapas concluídas", "teal"],
    ["book-half", state.signsSeen.length, "Sinais vistos", "teal"],
    ["shield-fill-check", state.streakFreezes, "Protetores", "coral"],
  ];

  return `
    <section class="profile-hero" aria-labelledby="profile-title">
      <button class="profile-hero-avatar ${backdropClass()}" type="button" data-screen="mascot" aria-label="Personalizar mascote">${mascotSvg(state.mascot, "full", "")}<span class="profile-hero-edit">${icon("palette-fill")}</span></button>
      <div class="profile-hero-copy">
        <small>${state.isMinor ? "ALUNO MENOR DE IDADE" : "SEU PERFIL"}</small>
        ${renderNameArea()}
        <p>Liga ${LEAGUES[state.league].name} · ${items.owned} de ${items.total} itens do mascote</p>
        ${state.editingName ? "" : `<button class="button-3d button-3d-light" type="button" data-screen="mascot">${icon("palette-fill")} Personalizar mascote</button>`}
      </div>
    </section>

    <section class="profile-group" aria-labelledby="profile-stats-title">
      <div class="mission-heading"><h2 id="profile-stats-title">Estatísticas</h2></div>
      <div class="profile-tiles">${tiles.map(renderProfileTile).join("")}</div>
    </section>

    <section class="profile-group" aria-labelledby="achievements-title">
      <div class="mission-heading"><h2 id="achievements-title">Conquistas</h2><span class="mission-timer">${icon("award-fill")} ${doneCount} de ${ACHIEVEMENTS.length}</span></div>
      <div class="badge-grid">${ACHIEVEMENTS.map(renderAchievement).join("")}</div>
    </section>
    <p class="demo-disclaimer">Este perfil é local e não representa uma conta autenticada.</p>`;
}

// Interruptor com as opções lado a lado (ex.: Claro | Escuro).
// options = [[valor, texto, ícone], ...]
function renderChoice(action, current, label, options) {
  const buttons = options.map(([value, text, iconName]) => {
    const isActive = current === value;
    return `<button class="segmented-option${isActive ? " is-active" : ""}" type="button" data-action="${action}" data-value="${value}" aria-pressed="${isActive}">${icon(iconName)} ${text}</button>`;
  }).join("");
  return `<div class="segmented" role="group" aria-label="${label}">${buttons}</div>`;
}

// Uma linha de configuração: ícone colorido, nome, explicação e o controle.
function renderSettingRow(iconName, color, title, text, control) {
  return `
    <div class="settings-row">
      <span class="settings-row-icon is-${color}">${icon(iconName)}</span>
      <div class="settings-row-text"><strong>${title}</strong><small>${text}</small></div>
      ${control}
    </div>`;
}

// Perguntas da Ajuda (cada uma abre e fecha ao tocar).
function helpQuestions() {
  const energyHours = ENERGY_RECHARGE_MS / 3600000;
  return [
    ["Como funcionam as vidas?", `Você tem ${MAX_LIVES} vidas. Cada resposta errada gasta uma, e uma vida volta a cada 30 minutos. O dicionário é livre.`],
    ["Como funciona a energia?", `Você tem ${MAX_ENERGY} de energia. Cada atividade nova concluída gasta 1, e 1 volta a cada ${energyHours} horas. Refazer o que já fez não gasta. Na lojinha dá para recarregar uma vez por dia.`],
    ["Como libero a prova final?", "Conclua os 5 exercícios da árvore da etapa. A prova fica no centro da árvore."],
    ["Como ganho moedas?", "Concluindo exercícios novos e resgatando missões. Use as moedas na lojinha."],
    ["O que é a vitrine do dia?", "Todo dia, 3 itens do mascote ficam à venda na lojinha. À meia-noite eles trocam por outros."],
    ["O que é a ofensiva?", "São os dias seguidos em que você praticou. Um protetor de ofensiva salva um dia perdido."],
  ];
}

function renderMore() {
  const faq = helpQuestions().map(([question, answer]) => `
    <details class="faq-item">
      <summary>${question}${icon("chevron-down")}</summary>
      <p>${answer}</p>
    </details>`).join("");
  const privacy = [
    "Não existe chat nem mensagens entre alunos.",
    "Nas ligas aparecem só apelidos e avatares.",
    "Nesta demonstração, os dados ficam só neste navegador e não são enviados.",
    "Não há compras com dinheiro real: as moedas são do jogo.",
  ].map((item) => `<li>${icon("check-circle-fill")} ${item}</li>`).join("");

  return `
    <section class="settings-hero" aria-labelledby="settings-title">
      <span class="settings-hero-icon">${icon("gear-fill")}</span>
      <div class="settings-hero-copy">
        <small>SEU JEITO</small>
        <h2 id="settings-title">Configurações</h2>
        <p>Deixe o EduSinal confortável para você.</p>
      </div>
    </section>

    <section class="settings-group" aria-labelledby="settings-prefs-title">
      <h2 class="settings-heading" id="settings-prefs-title">Preferências</h2>
      <div class="settings-card">
        ${renderSettingRow("palette-fill", "blue", "Tema", "Cores claras ou escuras.", renderChoice("set-theme", state.theme, "Tema", [["light", "Claro", "sun-fill"], ["dark", "Escuro", "moon-fill"]]))}
        ${renderSettingRow("type", "teal", "Tamanho do texto", "Deixa tudo um pouco maior.", renderChoice("set-text-size", state.textSize, "Tamanho do texto", [["normal", "Normal", "fonts"], ["large", "Grande", "zoom-in"]]))}
        ${renderSettingRow("stars", "yellow", "Animações", "Reduz movimentos na tela.", renderChoice("set-motion", state.motion, "Animações", [["normal", "Ligadas", "play-fill"], ["reduced", "Reduzidas", "pause-fill"]]))}
      </div>
    </section>

    <section class="settings-group" aria-labelledby="settings-help-title">
      <h2 class="settings-heading" id="settings-help-title">Ajuda</h2>
      <div class="settings-card settings-faq">${faq}</div>
    </section>

    <section class="settings-group" aria-labelledby="settings-privacy-title">
      <h2 class="settings-heading" id="settings-privacy-title">Segurança e privacidade</h2>
      <div class="settings-card"><ul class="settings-privacy">${privacy}</ul></div>
    </section>

    <section class="settings-group" aria-labelledby="settings-account-title">
      <h2 class="settings-heading" id="settings-account-title">Conta</h2>
      <div class="settings-card">
        ${renderSettingRow("arrow-counterclockwise", "coral", "Recomeçar demonstração", "Apaga XP, moedas e progresso deste navegador.", '<button class="button-3d button-3d-outline settings-danger" type="button" data-action="reset-demo">Recomeçar</button>')}
        ${renderSettingRow("box-arrow-right", "blue", "Sair", "Volta para a tela de apresentação.", '<button class="button-3d button-3d-outline" type="button" data-action="logout">Sair</button>')}
      </div>
    </section>

    <section class="settings-about" aria-label="Sobre o EduSinal">
      <img src="icones/icone-192.png" alt="" width="56" height="56" />
      <div><strong>EduSinal</strong><p>Aprender Libras de forma visual e no seu ritmo, com trilha, exercícios e dicionário.</p></div>
      <a class="text-button" href="../../landing/index.html">Conhecer o projeto ${icon("box-arrow-up-right")}</a>
    </section>`;
}
