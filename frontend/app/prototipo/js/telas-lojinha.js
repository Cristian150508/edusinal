// LOJINHA
// Tudo é comprado com moedas do jogo (não existe dinheiro real).
// Aqui ficam as ajudas. Roupas, acessórios e fundos do mascote são
// comprados no editor do mascote (telas-mascote.js).

const MAX_STREAK_FREEZES = 2;

// Ajudas: são usadas na hora (vidas) ou guardadas (protetor de ofensiva).
const POWER_UPS = [
  { id: "recarga-vidas", icon: "heart-pulse-fill", name: "Recarga de vidas", text: `Enche as ${MAX_LIVES} vidas na hora.`, cost: 30 },
  { id: "protetor-ofensiva", icon: "shield-fill-check", name: "Protetor de ofensiva", text: `Salva sua ofensiva se você ficar um dia sem praticar. Máximo de ${MAX_STREAK_FREEZES}.`, cost: 50 },
];

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
      <div class="shop-item-art shop-art-power"><span class="mascot-item-icon">${icon(power.icon)}</span></div>
      <div class="shop-item-copy">${owned}<h3>${power.name}</h3><p>${power.text}</p></div>
      <button class="button button-primary" type="button" data-action="buy-power" data-power="${power.id}" ${reason ? "disabled" : ""}>${reason || `Comprar · ${power.cost} moedas`}</button>
    </article>`;
}

function renderShop() {
  const forSale = MASCOT_ITEMS.filter((item) => item.unlock.type === "coins" && !isMascotItemOwned(item)).length;
  return `
    <section class="page-intro shop-intro">
      <div><p class="eyebrow">RECOMPENSAS DA JORNADA</p><h2>Lojinha</h2><p>Use as moedas que você ganha nos exercícios e nas missões. Não há compras com dinheiro real.</p></div>
      <span class="shop-balance"><i class="bi bi-coin" aria-hidden="true"></i> ${state.coins} moedas</span>
    </section>
    <section class="shop-group" aria-labelledby="shop-power-title"><div class="section-heading"><div><p class="eyebrow">PARA A JORNADA</p><h2 id="shop-power-title">Ajudas</h2></div></div><div class="shop-grid">${POWER_UPS.map(renderPowerUp).join("")}</div></section>
    <section class="shop-group" aria-labelledby="shop-mascot-title">
      <div class="section-heading"><div><p class="eyebrow">SEU PERSONAGEM</p><h2 id="shop-mascot-title">Guarda-roupa do mascote</h2></div></div>
      <div class="shop-mascot-banner">
        ${renderMascot("mascot-small")}
        <div><h3>Roupas, acessórios e fundos</h3><p>${forSale} ${forSale === 1 ? "item" : "itens"} à venda, além dos grátis e dos que vêm de conquistas.</p></div>
        <button class="button button-primary" type="button" data-screen="mascot">Abrir guarda-roupa <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
      </div>
    </section>
    <p class="demo-disclaimer">As moedas são de demonstração e os itens ficam salvos somente neste navegador.</p>`;
}
