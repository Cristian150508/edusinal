// DICIONÁRIO
// Consulta livre de sinais (não gasta vidas). Tem busca, categorias e o
// alfabeto manual. Os vídeos dos sinais ainda serão gravados.

const DICTIONARY_CATEGORIES = [
  { id: "alfabeto", label: "Alfabeto" },
  { id: "saudacoes", label: "Saudações" },
  { id: "numeros", label: "Números" },
  { id: "familia", label: "Família" },
  { id: "cores", label: "Cores" },
];

// Palavras de exemplo. "example" é uma frase em português para dar contexto.
const DICTIONARY_WORDS = [
  { id: "oi", word: "Oi", category: "saudacoes", example: "Oi, tudo bem?" },
  { id: "tchau", word: "Tchau", category: "saudacoes", example: "Tchau, até amanhã!" },
  { id: "bom-dia", word: "Bom dia", category: "saudacoes", example: "Bom dia, turma!" },
  { id: "boa-tarde", word: "Boa tarde", category: "saudacoes", example: "Boa tarde, professora." },
  { id: "boa-noite", word: "Boa noite", category: "saudacoes", example: "Boa noite, durma bem." },
  { id: "obrigado", word: "Obrigado(a)", category: "saudacoes", example: "Obrigada pela ajuda!" },
  { id: "por-favor", word: "Por favor", category: "saudacoes", example: "Pode repetir, por favor?" },
  { id: "desculpa", word: "Desculpa", category: "saudacoes", example: "Desculpa, não entendi." },
  { id: "um", word: "Um", category: "numeros", example: "Tenho um irmão." },
  { id: "dois", word: "Dois", category: "numeros", example: "São dois sinais novos." },
  { id: "tres", word: "Três", category: "numeros", example: "Faltam três dias." },
  { id: "quatro", word: "Quatro", category: "numeros", example: "Moro com quatro pessoas." },
  { id: "cinco", word: "Cinco", category: "numeros", example: "Cinco minutos de prática." },
  { id: "mae", word: "Mãe", category: "familia", example: "Minha mãe também aprende Libras." },
  { id: "pai", word: "Pai", category: "familia", example: "Meu pai mora perto." },
  { id: "irmao", word: "Irmão", category: "familia", example: "Meu irmão é surdo." },
  { id: "irma", word: "Irmã", category: "familia", example: "Minha irmã estuda comigo." },
  { id: "avo", word: "Avó", category: "familia", example: "Visitei minha avó." },
  { id: "azul", word: "Azul", category: "cores", example: "O mascote é azul." },
  { id: "verde", word: "Verde", category: "cores", example: "A folha é verde." },
  { id: "vermelho", word: "Vermelho", category: "cores", example: "O carro vermelho passou." },
  { id: "amarelo", word: "Amarelo", category: "cores", example: "O sol amarelo apareceu." },
  { id: "branco", word: "Branco", category: "cores", example: "O papel é branco." },
];

const UNLOCKED_LETTERS = "ABC";

// Tira acentos e maiúsculas para a busca achar "mae" em "Mãe".
function normalizeText(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function categoryLabel(categoryId) {
  return DICTIONARY_CATEGORIES.find((category) => category.id === categoryId).label;
}

// Guarda que o aluno viu um sinal: conta para a missão do dia e para a conquista.
function markSignViewed(signId) {
  if (!state.daily.signsViewed.includes(signId)) state.daily.signsViewed.push(signId);
  if (!state.signsSeen.includes(signId)) state.signsSeen.push(signId);
  persist();
}

function selectWord(wordId) {
  state.selectedWord = wordId;
  markSignViewed(wordId);
  render();
}

function selectLetter(letter) {
  state.selectedLetter = letter;
  markSignViewed(`letra-${letter}`);
  render();
}

function chooseDictionaryCategory(categoryId) {
  state.dictionaryCategory = categoryId;
  state.dictionaryQuery = "";
  state.selectedWord = null;
  render();
}

// Chamado a cada letra digitada na busca. Só troca a lista de resultados,
// para o campo de busca não perder o foco.
function searchDictionary(query) {
  state.dictionaryQuery = query;
  state.selectedWord = null;
  document.getElementById("dictionary-results").innerHTML = renderDictionaryResults();
}

function renderAlphabet() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
    const isUnlocked = UNLOCKED_LETTERS.includes(letter);
    const isSelected = state.selectedLetter === letter;
    return `<button class="alphabet-letter${isUnlocked ? " is-unlocked" : " is-locked"}${isSelected ? " is-selected" : ""}" type="button" data-alphabet-letter="${letter}" aria-label="${isUnlocked ? `Letra ${letter}` : `Letra ${letter}, bloqueada`}" ${isUnlocked ? `aria-pressed="${isSelected}"` : "disabled"}>${isUnlocked ? "" : '<span class="alphabet-lock" aria-hidden="true">&#128274;</span>'}<span>${letter}</span></button>`;
  }).join("");

  return `
    <section class="alphabet-section" aria-labelledby="alphabet-title"><div class="section-heading"><div><p class="eyebrow">ALFABETO MANUAL · ${UNLOCKED_LETTERS.length} DE 26 LETRAS</p><h2 id="alphabet-title">Escolha uma letra</h2></div><span class="alphabet-legend"><span aria-hidden="true">&#128274;</span> Em breve</span></div><div class="alphabet-grid" aria-label="Alfabeto manual, letras A a Z">${letters}</div></section>
    <section class="alphabet-detail" aria-live="polite" aria-labelledby="selected-letter-title"><div class="alphabet-detail-letter" aria-hidden="true">${state.selectedLetter}</div><div class="alphabet-detail-copy"><p class="eyebrow">LETRA LIBERADA</p><h2 id="selected-letter-title">Letra ${state.selectedLetter}</h2><p>O material visual desta letra está sendo preparado para revisão por pessoas fluentes em Libras. Consulte um professor ou intérprete para aprender a configuração correta da mão.</p></div><span class="alphabet-detail-mark" aria-hidden="true">✳</span></section>`;
}

function renderWordDetail(word) {
  if (!word) {
    return '<aside class="word-detail word-detail-empty"><span aria-hidden="true">◉</span><p>Escolha uma palavra para ver o sinal.</p></aside>';
  }
  return `
    <aside class="word-detail" aria-live="polite">
      <div class="word-video" aria-hidden="true"><span>▶</span><small>Vídeo em produção</small></div>
      <p class="eyebrow">${categoryLabel(word.category).toUpperCase()}</p>
      <h2>${word.word}</h2>
      <p>Exemplo de uso: “${word.example}”</p>
      <p class="word-note">O vídeo deste sinal será gravado e revisado por pessoas surdas fluentes em Libras.</p>
    </aside>`;
}

// Resultado da busca ou da categoria escolhida.
function renderDictionaryResults() {
  const query = normalizeText(state.dictionaryQuery.trim());
  if (!query && state.dictionaryCategory === "alfabeto") return renderAlphabet();

  const words = query
    ? DICTIONARY_WORDS.filter((word) => normalizeText(word.word).includes(query))
    : DICTIONARY_WORDS.filter((word) => word.category === state.dictionaryCategory);

  if (words.length === 0) {
    return `<p class="dictionary-empty">Nenhum sinal encontrado para “${escapeHtml(state.dictionaryQuery)}”. Tente outra palavra.</p>`;
  }

  const cards = words.map((word) => {
    const isSelected = state.selectedWord === word.id;
    const seen = state.signsSeen.includes(word.id) ? '<small class="word-seen">visto ✓</small>' : "";
    return `<button class="word-card${isSelected ? " is-selected" : ""}" type="button" data-action="select-word" data-word="${word.id}" aria-pressed="${isSelected}"><strong>${word.word}</strong><small>${categoryLabel(word.category)}</small>${seen}</button>`;
  }).join("");

  const selected = words.find((word) => word.id === state.selectedWord);
  const title = query ? `Resultados para “${escapeHtml(state.dictionaryQuery.trim())}”` : categoryLabel(state.dictionaryCategory);
  return `
    <div class="section-heading"><div><p class="eyebrow">${words.length} ${words.length === 1 ? "SINAL" : "SINAIS"}</p><h2>${title}</h2></div></div>
    <div class="dictionary-layout"><div class="word-grid">${cards}</div>${renderWordDetail(selected)}</div>`;
}

function renderSigns() {
  const chips = DICTIONARY_CATEGORIES.map((category) => {
    const isActive = !state.dictionaryQuery && state.dictionaryCategory === category.id;
    return `<button class="category-chip${isActive ? " is-active" : ""}" type="button" data-action="dictionary-category" data-category="${category.id}" aria-pressed="${isActive}">${category.label}</button>`;
  }).join("");

  return `
    <section class="page-intro"><div><p class="eyebrow">DICIONÁRIO DE LIBRAS</p><h2>Dicionário</h2><p>Consulte sinais quando quiser. Revisar é livre e não gasta vidas.</p></div><span class="demo-pill">${state.signsSeen.length} SINAIS VISTOS</span></section>
    <div class="dictionary-tools">
      <input class="dictionary-search" id="dictionary-search" type="search" placeholder="Buscar palavra, ex.: obrigado" aria-label="Buscar palavra no dicionário" value="${escapeHtml(state.dictionaryQuery)}" autocomplete="off" />
      <div class="dictionary-categories" role="group" aria-label="Categorias do dicionário">${chips}</div>
    </div>
    <div id="dictionary-results">${renderDictionaryResults()}</div>
    <p class="demo-disclaimer">O alfabeto manual representa letras; Libras é uma língua completa, com gramática e sinais próprios.</p>`;
}
