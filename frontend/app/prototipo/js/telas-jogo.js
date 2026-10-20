// TELAS DE JOGO E CONTEÚDO
// Lojinha, dicionário, ligas, missões, perfil e "Mais opções".

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

function renderSigns() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const letters = alphabet.map((letter) => {
    const isUnlocked = "ABC".includes(letter);
    const isSelected = state.selectedLetter === letter;
    return `<button class="alphabet-letter${isUnlocked ? " is-unlocked" : " is-locked"}${isSelected ? " is-selected" : ""}" type="button" data-alphabet-letter="${letter}" aria-label="${isUnlocked ? `Letra ${letter}` : `Letra ${letter}, bloqueada`}" ${isUnlocked ? `aria-pressed="${isSelected}"` : "disabled"}>${isUnlocked ? "" : '<span class="alphabet-lock" aria-hidden="true">&#128274;</span>'}<span>${letter}</span></button>`;
  }).join("");

  return `
    <section class="page-intro"><div><p class="eyebrow">DICIONÁRIO DE LIBRAS</p><h2>Alfabeto manual</h2><p>Explore as primeiras letras liberadas. As próximas serão adicionadas em etapas futuras.</p></div><span class="demo-pill">3 DE 26 LETRAS</span></section>
    <section class="alphabet-section" aria-labelledby="alphabet-title"><div class="section-heading"><div><p class="eyebrow">PRIMEIROS PASSOS</p><h2 id="alphabet-title">Escolha uma letra</h2></div><span class="alphabet-legend"><span aria-hidden="true">&#128274;</span> Em breve</span></div><div class="alphabet-grid" aria-label="Alfabeto manual, letras A a Z">${letters}</div></section>
    <section class="alphabet-detail" aria-live="polite" aria-labelledby="selected-letter-title"><div class="alphabet-detail-letter" aria-hidden="true">${state.selectedLetter}</div><div class="alphabet-detail-copy"><p class="eyebrow">LETRA LIBERADA</p><h2 id="selected-letter-title">Letra ${state.selectedLetter}</h2><p>O material visual desta letra está sendo preparado para revisão por pessoas fluentes em Libras. Consulte um professor ou intérprete para aprender a configuração correta da mão.</p></div><span class="alphabet-detail-mark" aria-hidden="true">✳</span></section>
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
