// MASCOTE PERSONALIZÁVEL
// Lista de roupas e acessórios, as regras para liberar cada um e a tela
// do editor. O desenho em si fica em mascote-desenho.js.
//
// Formas de liberar um item (campo "unlock"):
//   { type: "free" }                      grátis desde o começo
//   { type: "coins", cost: 30 }           comprado com moedas
//   { type: "reward" }                    ganho em um momento do jogo (broche da 1ª atividade)
//   { type: "achievement", id: "etapa" }  ganho ao completar uma conquista do perfil

// Partes que podem ser trocadas, na ordem das abas do editor.
const MASCOT_SLOTS = [
  { id: "shirt", label: "Roupa", crop: "full" },
  { id: "head", label: "Cabeça", crop: "head" },
  { id: "face", label: "Rosto", crop: "head" },
  { id: "chest", label: "Broche", crop: "full" },
  { id: "background", label: "Fundo", crop: "full" },
];

// Visual da logo: camiseta branca e nada mais.
const DEFAULT_LOOK = { shirt: "camiseta-branca", head: "", face: "", chest: "", background: "" };

const MASCOT_ITEMS = [
  // Roupas (fill = cor, trim = gola, design = estilo)
  { id: "camiseta-branca", slot: "shirt", name: "Clássica da logo", fill: "#ffffff", trim: "#1652c7", design: "plain", unlock: { type: "free" } },
  { id: "camiseta-azul", slot: "shirt", name: "Camiseta azul", fill: "#3d8bfd", trim: "#1652c7", design: "plain", unlock: { type: "free" } },
  { id: "camiseta-turquesa", slot: "shirt", name: "Camiseta turquesa", fill: "#2bbbb3", trim: "#137a75", design: "plain", unlock: { type: "free" } },
  { id: "camiseta-coral", slot: "shirt", name: "Camiseta coral", fill: "#f07a68", trim: "#b84a3a", design: "plain", unlock: { type: "coins", cost: 20 } },
  { id: "camiseta-amarela", slot: "shirt", name: "Camiseta amarela", fill: "#f7cd4d", trim: "#b58a12", design: "plain", unlock: { type: "coins", cost: 20 } },
  { id: "camiseta-listrada", slot: "shirt", name: "Listrada", fill: "#ffffff", stripe: "#9cc3f0", trim: "#1652c7", design: "stripes", unlock: { type: "coins", cost: 35 } },
  { id: "moletom-edusinal", slot: "shirt", name: "Moletom EduSinal", fill: "#24497f", trim: "#162f55", design: "hoodie", unlock: { type: "achievement", id: "etapa" } },
  { id: "camisa-campeao", slot: "shirt", name: "Camisa de campeão", fill: "#f2c230", trim: "#b8860b", design: "champion", unlock: { type: "achievement", id: "liga" } },

  // Cabeça
  { id: "", slot: "head", name: "Nada", unlock: { type: "free" } },
  { id: "bone", slot: "head", name: "Boné", unlock: { type: "free" } },
  { id: "laco", slot: "head", name: "Laço", unlock: { type: "free" } },
  { id: "chapeu-festa", slot: "head", name: "Chapéu de festa", unlock: { type: "coins", cost: 30 } },
  { id: "tiara-flores", slot: "head", name: "Tiara de flores", unlock: { type: "coins", cost: 40 } },
  { id: "coroa", slot: "head", name: "Coroa", unlock: { type: "achievement", id: "ofensiva" } },

  // Rosto
  { id: "", slot: "face", name: "Nada", unlock: { type: "free" } },
  { id: "bochechas", slot: "face", name: "Bochechas", unlock: { type: "free" } },
  { id: "oculos-redondos", slot: "face", name: "Óculos redondos", unlock: { type: "free" } },
  { id: "oculos-sol", slot: "face", name: "Óculos de sol", unlock: { type: "coins", cost: 30 } },

  // Broches (os mesmos ids e preços da lojinha antiga, para ninguém perder o que comprou)
  { id: "", slot: "chest", name: "Nada", unlock: { type: "free" } },
  { id: "broche-sinal", slot: "chest", name: "Broche de sinais", unlock: { type: "reward" } },
  { id: "estrela-coral", slot: "chest", name: "Estrela coral", unlock: { type: "coins", cost: 25 } },
  { id: "flor-amarela", slot: "chest", name: "Flor amarela", unlock: { type: "coins", cost: 40 } },
  { id: "folha-azul", slot: "chest", name: "Folha azul", unlock: { type: "coins", cost: 60 } },

  // Fundos (cor atrás do mascote)
  { id: "", slot: "background", name: "Azul da logo", unlock: { type: "free" } },
  { id: "fundo-ceu", slot: "background", name: "Céu azul", unlock: { type: "coins", cost: 20 } },
  { id: "fundo-mar", slot: "background", name: "Mar turquesa", unlock: { type: "coins", cost: 30 } },
  { id: "fundo-por-do-sol", slot: "background", name: "Pôr do sol", unlock: { type: "coins", cost: 30 } },
  { id: "fundo-sol", slot: "background", name: "Sol da manhã", unlock: { type: "coins", cost: 30 } },
];

function findMascotItem(slot, id) {
  return MASCOT_ITEMS.find((item) => item.slot === slot && item.id === id);
}

// O aluno já pode usar este item?
function isMascotItemOwned(item) {
  const unlock = item.unlock;
  if (unlock.type === "free") return true;
  if (unlock.type === "achievement") {
    const achievement = ACHIEVEMENTS.find((entry) => entry.id === unlock.id);
    return achievement.progress() >= achievement.target;
  }
  return state.unlockedItems.includes(item.id); // moedas ou recompensa
}

// Texto curto que explica como liberar o item.
function unlockLabel(item) {
  const unlock = item.unlock;
  if (unlock.type === "coins") return `${unlock.cost} ${icon("coin")}`;
  if (unlock.type === "reward") return "1ª atividade";
  if (unlock.type === "achievement") return `Conquista: ${ACHIEVEMENTS.find((entry) => entry.id === unlock.id).title}`;
  return "Grátis";
}

// O visual atual trocando só uma parte (usado nas miniaturas do editor).
function lookWith(slot, id) {
  return { ...state.mascot, [slot]: id };
}

// Classe CSS do fundo atrás do mascote (sem fundo comprado = azul da logo).
function backdropClass(look = state.mascot) {
  return look.background ? `mascot-backdrop bg-${look.background}` : "mascot-backdrop";
}

// Mascote pronto para colocar em qualquer tela, com o fundo escolhido.
function renderMascot(extraClass = "", look = state.mascot) {
  return `<div class="mascot-avatar ${backdropClass(look)} ${extraClass}">${mascotSvg(look, "full", `Mascote de ${state.name}`)}</div>`;
}

// ----- Ações do editor -----

// Clique em um item: usa se já for do aluno; compra se custar moedas.
function chooseMascotItem(slot, id) {
  const item = findMascotItem(slot, id);
  if (!item) return;

  if (!isMascotItemOwned(item)) {
    if (item.unlock.type === "achievement") {
      showToast(`Complete a conquista “${ACHIEVEMENTS.find((entry) => entry.id === item.unlock.id).title}” no perfil para liberar.`);
      return;
    }
    if (item.unlock.type === "reward") {
      showToast("Complete a primeira atividade para receber este item.");
      return;
    }
    if (state.coins < item.unlock.cost) {
      showToast("Você ainda não tem moedas suficientes.");
      return;
    }
    state.coins -= item.unlock.cost;
    state.unlockedItems.push(item.id);
    showToast(`${item.name} comprado: −${item.unlock.cost} moedas.`);
  }

  state.mascot[slot] = id;
  persist();
  render();
}

function chooseMascotTab(slot) {
  state.mascotTab = slot;
  render();
}

// Volta para o visual da logo (os itens comprados continuam do aluno).
function resetMascotLook() {
  state.mascot = { ...DEFAULT_LOOK };
  persist();
  render();
  showToast("Visual da logo restaurado. Seus itens continuam guardados.");
}

// ----- Tela do editor -----

function renderMascotOption(item, slotInfo) {
  const isEquipped = state.mascot[item.slot] === item.id;
  const isOwned = isMascotItemOwned(item);

  let status = isOwned ? "Usar" : unlockLabel(item);
  if (isEquipped) status = "Em uso";
  if (!isOwned && item.unlock.type === "achievement") status = `${icon("lock-fill")} ${unlockLabel(item)}`;

  // Miniatura: o mascote atual vestindo este item, sobre o fundo escolhido.
  const look = lookWith(item.slot, item.id);
  const preview = `<span class="mascot-option-art ${slotInfo.crop === "head" ? "is-head" : ""} ${backdropClass(look)}">${mascotSvg(look, slotInfo.crop, "")}</span>`;

  const classes = ["mascot-option"];
  if (isEquipped) classes.push("is-equipped");
  if (!isOwned) classes.push("is-locked");
  return `<button class="${classes.join(" ")}" type="button" data-action="mascot-item" data-slot="${item.slot}" data-item="${item.id}" aria-pressed="${isEquipped}">${preview}<strong>${item.name}</strong><small>${status}</small></button>`;
}

function renderMascotEditor() {
  const slotInfo = MASCOT_SLOTS.find((slot) => slot.id === state.mascotTab);
  const tabs = MASCOT_SLOTS.map((slot) => {
    const isActive = slot.id === state.mascotTab;
    return `<button class="category-chip${isActive ? " is-active" : ""}" type="button" data-action="mascot-tab" data-slot="${slot.id}" aria-pressed="${isActive}">${slot.label}</button>`;
  }).join("");
  const options = MASCOT_ITEMS.filter((item) => item.slot === slotInfo.id).map((item) => renderMascotOption(item, slotInfo)).join("");
  const ownedCount = MASCOT_ITEMS.filter((item) => item.id && isMascotItemOwned(item)).length;
  const totalCount = MASCOT_ITEMS.filter((item) => item.id).length;

  return `
    <section class="page-intro">
      <div><p class="eyebrow">SEU PERSONAGEM</p><h2>Personalizar mascote</h2><p>Escolha roupa e acessórios. Itens com preço são comprados com moedas; os com cadeado vêm de conquistas.</p></div>
      <span class="shop-balance"><i class="bi bi-coin" aria-hidden="true"></i> ${state.coins} moedas</span>
    </section>
    <div class="mascot-editor">
      <aside class="mascot-stage">
        ${renderMascot("mascot-large")}
        <strong>${escapeHtml(state.name)}</strong>
        <small>${ownedCount} de ${totalCount} itens liberados</small>
        <button class="text-button" type="button" data-action="mascot-reset">Voltar ao visual da logo</button>
      </aside>
      <section class="mascot-wardrobe" aria-label="Guarda-roupa">
        <div class="dictionary-categories" role="group" aria-label="Partes do mascote">${tabs}</div>
        <div class="mascot-options">${options}</div>
      </section>
    </div>
    <p class="demo-disclaimer">As moedas são de demonstração e os itens ficam salvos somente neste navegador.</p>`;
}
