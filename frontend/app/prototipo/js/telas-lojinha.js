// LOJINHA
// Tudo é comprado com moedas do jogo (não existe dinheiro real).
// Três tipos de coisa: ajudas, acessórios do mascote e fundos do perfil.

// type "accessory" vai no mascote; type "background" é a cor atrás dele.
const shopItems = [
  { id: "broche-sinal", type: "accessory", name: "Broche de sinais", icon: "🤟", reward: true },
  { id: "estrela-coral", type: "accessory", name: "Estrela coral", icon: "✦", cost: 25 },
  { id: "flor-amarela", type: "accessory", name: "Flor amarela", icon: "✿", cost: 40 },
  { id: "folha-azul", type: "accessory", name: "Folha azul", icon: "❋", cost: 60 },
  { id: "fundo-ceu", type: "background", name: "Céu azul", cost: 20 },
  { id: "fundo-mar", type: "background", name: "Mar turquesa", cost: 30 },
  { id: "fundo-por-do-sol", type: "background", name: "Pôr do sol", cost: 30 },
  { id: "fundo-sol", type: "background", name: "Sol da manhã", cost: 30 },
];

const MAX_STREAK_FREEZES = 2;

// Ajudas: são usadas na hora (vidas) ou guardadas (protetor de ofensiva).
const POWER_UPS = [
  { id: "recarga-vidas", icon: "♥", name: "Recarga de vidas", text: `Enche as ${MAX_LIVES} vidas na hora.`, cost: 30 },
  { id: "protetor-ofensiva", icon: "🛡", name: "Protetor de ofensiva", text: `Salva sua ofensiva se você ficar um dia sem praticar. Máximo de ${MAX_STREAK_FREEZES}.`, cost: 50 },
];

// Mascote com o acessório e o fundo escolhidos (usado na lojinha e no perfil).
function renderMascot(extraClass = "") {
  const accessory = shopItems.find((item) => item.id === state.equippedItem);
  const background = state.equippedBackground ? ` bg-${state.equippedBackground}` : "";
  return `<div class="mascot-avatar${background} ${extraClass}"><img src="../../assets/images/Mascote%20Libras%20em%20Azul%20vibrante.png" alt="Mascote de ${escapeHtml(state.name)}" />${accessory ? `<span class="mascot-accessory" aria-label="${accessory.name}">${accessory.icon}</span>` : ""}</div>`;
}

function isEquipped(item) {
  return item.type === "background" ? state.equippedBackground === item.id : state.equippedItem === item.id;
}

function buyOrEquipItem(itemId) {
  const item = shopItems.find((entry) => entry.id === itemId);
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
  if (item.type === "background") state.equippedBackground = item.id;
  else state.equippedItem = item.id;
  persist();
  render();
  showToast(`${item.name} equipado no mascote.`);
}

// Se a ajuda pode ser comprada agora; se não, o motivo.
function powerUpBlockReason(power) {
  if (power.id === "recarga-vidas") {
    refreshLives();
    if (state.lives >= MAX_LIVES) return "Vidas completas";
  }
  if (power.id === "protetor-ofensiva" && state.streakFreezes >= MAX_STREAK_FREEZES) return `Você já tem ${MAX_STREAK_FREEZES}`;
  if (state.coins < power.cost) return "Moedas insuficientes";
  return "";
}

function buyPowerUp(powerId) {
  const power = POWER_UPS.find((entry) => entry.id === powerId);
  if (!power || powerUpBlockReason(power)) return;

  state.coins -= power.cost;
  if (power.id === "recarga-vidas") {
    state.lives = MAX_LIVES;
    state.nextLifeAt = null;
    showToast("Vidas recarregadas!");
  } else {
    state.streakFreezes += 1;
    showToast("Protetor de ofensiva guardado.");
  }
  persist();
  render();
}

function renderPowerUp(power) {
  const reason = powerUpBlockReason(power);
  const owned = power.id === "protetor-ofensiva" ? `<span class="shop-item-source">Você tem ${state.streakFreezes}</span>` : '<span class="shop-item-source">Ajuda</span>';
  return `
    <article class="shop-item">
      <div class="shop-item-art shop-art-power"><span class="mascot-item-icon">${power.icon}</span></div>
      <div class="shop-item-copy">${owned}<h3>${power.name}</h3><p>${power.text}</p></div>
      <button class="button button-primary" type="button" data-action="buy-power" data-power="${power.id}" ${reason ? "disabled" : ""}>${reason || `Comprar · ${power.cost} moedas`}</button>
    </article>`;
}

function renderShopItem(item) {
  const isOwned = state.unlockedItems.includes(item.id);
  const equipped = isEquipped(item);
  const isUnavailable = item.reward && !isOwned;
  const cannotAfford = !isOwned && !item.reward && state.coins < item.cost;
  const actionLabel = equipped ? "Em uso" : isOwned ? "Usar" : item.reward ? "Ganhe no desafio" : `Comprar · ${item.cost} moedas`;

  let description = "Um detalhe para o mascote do seu perfil.";
  if (item.reward) description = isOwned ? "Ganho na sua primeira atividade." : "Complete sua primeira atividade para desbloquear este item.";
  if (item.type === "background") description = "Cor de fundo atrás do mascote no perfil.";

  const art = item.type === "background"
    ? `<div class="shop-item-art bg-${item.id}"></div>`
    : `<div class="shop-item-art"><span class="mascot-item-icon">${item.icon}</span></div>`;

  return `
    <article class="shop-item">
      ${art}
      <div class="shop-item-copy"><span class="shop-item-source">${isOwned ? "Seu item" : item.reward ? "Recompensa" : "Lojinha"}</span><h3>${item.name}</h3><p>${description}</p></div>
      <button class="button ${isOwned ? "button-outline" : "button-primary"}" type="button" data-shop-item="${item.id}" ${equipped || isUnavailable || cannotAfford ? "disabled" : ""}>${actionLabel}</button>
    </article>`;
}

function renderShop() {
  const accessories = shopItems.filter((item) => item.type === "accessory").map(renderShopItem).join("");
  const backgrounds = shopItems.filter((item) => item.type === "background").map(renderShopItem).join("");
  return `
    <section class="page-intro shop-intro">
      <div><p class="eyebrow">RECOMPENSAS DA JORNADA</p><h2>Lojinha</h2><p>Use as moedas que você ganha nos exercícios e nas missões. Não há compras com dinheiro real.</p></div>
      <div class="shop-preview">${renderMascot("mascot-small")}<span class="shop-balance"><span aria-hidden="true">✦</span> ${state.coins} moedas</span></div>
    </section>
    <section class="shop-group" aria-labelledby="shop-power-title"><div class="section-heading"><div><p class="eyebrow">PARA A JORNADA</p><h2 id="shop-power-title">Ajudas</h2></div></div><div class="shop-grid">${POWER_UPS.map(renderPowerUp).join("")}</div></section>
    <section class="shop-group" aria-labelledby="shop-accessory-title"><div class="section-heading"><div><p class="eyebrow">MASCOTE</p><h2 id="shop-accessory-title">Acessórios</h2></div></div><div class="shop-grid">${accessories}</div></section>
    <section class="shop-group" aria-labelledby="shop-background-title"><div class="section-heading"><div><p class="eyebrow">PERFIL</p><h2 id="shop-background-title">Fundos</h2></div></div><div class="shop-grid">${backgrounds}</div></section>
    <p class="demo-disclaimer">As moedas são de demonstração e os itens ficam salvos somente neste navegador.</p>`;
}
