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

// Estado atual de cada ajuda (mostrado no cartão).
function powerUpStatus(power) {
  if (power.id === "recarga-vidas") return `${icon("heart-fill")} ${state.lives} de ${MAX_LIVES} vidas`;
  return `${icon("shield-fill-check")} Você tem ${state.streakFreezes} de ${MAX_STREAK_FREEZES}`;
}

function renderPowerUp(power) {
  const reason = powerUpBlockReason(power);
  const button = reason
    ? `<button class="button-3d shop-buy" type="button" disabled>${reason}</button>`
    : `<button class="button-3d button-3d-gold shop-buy" type="button" data-action="buy-power" data-power="${power.id}">Comprar ${icon("coin")} ${power.cost}</button>`;
  return `
    <article class="shop-card shop-card-${power.id}">
      <span class="shop-card-icon">${icon(power.icon)}</span>
      <h3>${power.name}</h3>
      <p>${power.text}</p>
      <span class="shop-card-status">${powerUpStatus(power)}</span>
      ${button}
    </article>`;
}

function renderShop() {
  const forSale = MASCOT_ITEMS.filter((item) => item.unlock.type === "coins" && !isMascotItemOwned(item)).length;
  return `
    <section class="shop-hero" aria-labelledby="shop-title">
      <span class="shop-hero-coin">${icon("coin")}</span>
      <div class="shop-hero-copy">
        <small>RECOMPENSAS DA JORNADA</small>
        <h2 id="shop-title">Lojinha</h2>
        <p>Use as moedas dos exercícios e das missões. Não há compras com dinheiro real.</p>
      </div>
      <span class="shop-hero-balance"><strong>${state.coins}</strong> moedas</span>
    </section>
    <section class="shop-group" aria-labelledby="shop-power-title">
      <div class="mission-heading"><h2 id="shop-power-title">Ajudas</h2><span class="mission-timer">${icon("lightning-charge-fill")} Para a jornada</span></div>
      <div class="shop-grid">${POWER_UPS.map(renderPowerUp).join("")}</div>
    </section>
    <section class="shop-group" aria-labelledby="shop-mascot-title">
      <div class="mission-heading"><h2 id="shop-mascot-title">Guarda-roupa do mascote</h2><span class="mission-timer">${icon("bag-heart-fill")} ${forSale} ${forSale === 1 ? "item" : "itens"} à venda</span></div>
      <div class="shop-wardrobe">
        <span class="shop-wardrobe-mascot ${backdropClass()}">${mascotSvg(state.mascot, "full", "")}</span>
        <div><h3>Roupas, acessórios e fundos</h3><p>Compre com moedas, ganhe com conquistas ou use os grátis. Tudo aparece na hora no seu mascote.</p></div>
        <button class="button-3d button-3d-primary" type="button" data-screen="mascot">Abrir guarda-roupa ${icon("arrow-right")}</button>
      </div>
    </section>
    <p class="demo-disclaimer">As moedas são de demonstração e os itens ficam salvos somente neste navegador.</p>`;
}
