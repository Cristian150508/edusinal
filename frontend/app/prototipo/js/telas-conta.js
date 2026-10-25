// CADASTRO E LOGIN
// Telas de cadastro e entrada, e a validação dos dados. Tudo demonstrativo:
// o perfil fica só neste navegador e nenhuma senha é salva ou enviada.
// Entrar = voltar ao perfil salvo aqui, usando o mesmo e-mail do cadastro.

const WELCOME_COINS = 20; // moedas de boas-vindas de um perfil novo

function hasStrongPassword(password) {
  return password.length >= 8
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}

function renderSignup() {
  return `
    <section class="signup-layout" aria-labelledby="signup-title"><div class="signup-intro"><p class="eyebrow">BEM-VINDE AO EDUSINAL</p><h2>Aprender Libras pode aproximar todo mundo.</h2><p>Crie seu perfil de aluno e comece uma jornada de aprendizagem no seu ritmo.</p><div class="signup-aside"><i class="bi bi-info-circle-fill" aria-hidden="true"></i><span>Cadastro demonstrativo: o perfil fica salvo só neste navegador e nada é enviado.</span></div></div><div class="signup-form-panel"><div class="signup-title"><span class="eyebrow">CRIAR PERFIL</span><h3 id="signup-title">Dados do aluno</h3></div><form id="signup-form" novalidate><div class="form-grid"><label class="field-label" for="signup-name">Nome completo<input id="signup-name" name="name" autocomplete="name" placeholder="Seu nome" required /></label><label class="field-label" for="signup-age">Idade<input id="signup-age" name="age" type="number" inputmode="numeric" min="1" max="120" step="1" placeholder="Idade em anos" required /></label><label class="field-label" for="signup-email">E-mail<input id="signup-email" name="email" type="email" autocomplete="email" placeholder="voce@email.com" required /></label><label class="field-label" for="signup-password">Senha<input id="signup-password" name="password" type="password" autocomplete="new-password" placeholder="Crie uma senha" required /></label><label class="field-label signup-field-full" for="signup-confirm-password">Confirme a senha<input id="signup-confirm-password" name="passwordConfirmation" type="password" autocomplete="new-password" placeholder="Digite a senha novamente" required /></label></div><p class="field-hint">Use ao menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo.</p><p class="form-error" id="form-error" role="alert" aria-live="polite"></p><button class="button button-primary button-full" type="submit">Criar perfil <i class="bi bi-arrow-right" aria-hidden="true"></i></button><p class="form-legal">A idade não é verificada e a senha não é salva nem enviada.</p><div class="login-register"><span>Já tem uma conta?</span><button class="text-button" type="button" data-screen="login">Entrar <i class="bi bi-arrow-right" aria-hidden="true"></i></button></div></form></div></section>`;
}

function renderLogin() {
  return `
    <section class="login-layout" aria-labelledby="login-title">
      <div class="signup-intro login-intro">
        <p class="eyebrow">BEM-VINDE DE VOLTA</p>
        <h2 id="login-title">Continue sua jornada no EduSinal.</h2>
        <p>Entre com o e-mail do perfil que você criou neste navegador.</p>
        <button class="text-button" type="button" data-screen="intro"><i class="bi bi-arrow-left" aria-hidden="true"></i> Voltar ao início</button>
      </div>
      <div class="signup-form-panel login-panel">
        <div class="signup-title"><span class="eyebrow">ACESSO</span><h3>Entrar na sua conta</h3></div>
        <form id="login-form" novalidate>
          <label class="field-label" for="login-email">E-mail<input id="login-email" name="email" type="email" autocomplete="username" placeholder="voce@email.com" required /></label>
          <label class="field-label" for="login-password">Senha<input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Sua senha" required /></label>
          <p class="form-error" id="login-message" role="status" aria-live="polite"></p>
          <button class="button button-primary button-full" type="submit">Entrar <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
        </form>
        <p class="form-legal">Demonstração: sem servidor, a senha não é conferida. Só o e-mail precisa ser o do perfil salvo aqui.</p>
        <div class="login-register"><span>Ainda não tem conta?</span><button class="text-button" type="button" data-screen="signup">Criar cadastro <i class="bi bi-arrow-right" aria-hidden="true"></i></button></div>
      </div>
    </section>`;
}

// Confere os campos do cadastro. Devolve o texto do erro, ou "" quando está tudo certo.
function validateSignupForm(form) {
  const name = form.elements.name.value.trim();
  const age = Number(form.elements.age.value);
  const password = form.elements.password.value;

  if (name.length < 3) return "Informe seu nome completo (pelo menos 3 caracteres).";
  if (!Number.isInteger(age) || age < 1 || age > 120) return "Informe uma idade válida entre 1 e 120 anos.";
  if (!form.elements.email.value.trim() || !form.elements.email.validity.valid) return "Informe um e-mail válido.";
  if (!hasStrongPassword(password)) return "A senha precisa ter 8 caracteres, maiúscula, minúscula, número e símbolo.";
  if (password !== form.elements.passwordConfirmation.value) return "As senhas não conferem.";
  return "";
}

// Existe um perfil criado neste navegador? (mesmo que a pessoa tenha saído)
function hasSavedProfile() {
  const saved = JSON.parse(localStorage.getItem("edusinal-prototype") || "{}");
  return Boolean(saved.email || saved.isRegistered || saved.role);
}

// Perfil novo começa do zero. Só as preferências de tela (tema, texto, animações) continuam.
function startNewProfile(name, email, isMinor) {
  Object.assign(state, {
    name,
    email,
    isMinor,
    isRegistered: true,
    xp: 0,
    coins: WELCOME_COINS,
    streak: 0,
    lastActiveDate: null,
    streakFreezes: 0,
    practiceDays: [],
    frozenDays: [],
    league: 0,
    lives: MAX_LIVES,
    nextLifeAt: null,
    energy: MAX_ENERGY,
    nextEnergyAt: null,
    energyRefillDate: null,
    alphabetChallengeDate: null,
    unlockedItems: [],
    mascot: { ...DEFAULT_LOOK },
    hasFirstActivityReward: false,
    completedLessons: [],
    signsSeen: [],
    daily: emptyDay(),
    week: { key: weekKey(), xp: 0, claimed: [] },
  });
  persist();
}

function handleLoginSubmit(form) {
  const message = document.getElementById("login-message");
  const email = form.elements.email.value.trim().toLowerCase();

  let error = "";
  if (!email || !form.elements.email.validity.valid) error = "Informe um e-mail válido.";
  else if (!form.elements.password.value) error = "Digite sua senha.";
  else if (!hasSavedProfile()) error = "Ainda não há um perfil neste navegador. Crie um cadastro para começar.";
  else if (state.email && state.email !== email) error = "Esse e-mail não é o do perfil salvo neste navegador.";

  message.textContent = error;
  if (error) return;

  if (!state.email) state.email = email; // perfis antigos ainda não guardavam o e-mail
  state.isRegistered = true;
  persist();
  setScreen("trail");
  showToast(`Bem-vinde de volta, ${state.name}!`);
}

function handleSignupSubmit(form) {
  const errorBox = document.getElementById("form-error");
  const error = validateSignupForm(form);
  errorBox.textContent = error;
  if (error) return;

  const name = form.elements.name.value.trim().split(" ")[0];
  const email = form.elements.email.value.trim().toLowerCase();
  const isMinor = Number(form.elements.age.value) < 18;
  const create = () => {
    startNewProfile(name, email, isMinor);
    setScreen("trail");
    showToast(`Perfil criado! Você ganhou ${WELCOME_COINS} moedas de boas-vindas.`);
  };

  if (!hasSavedProfile()) {
    create();
    return;
  }
  askConfirm({
    title: "Criar um novo perfil?",
    text: `Já existe o perfil de ${state.name} neste navegador. Criar um novo apaga esse progresso.`,
    confirmLabel: "Criar novo perfil",
  }, create);
}
