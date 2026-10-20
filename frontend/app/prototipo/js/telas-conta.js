// CADASTRO E LOGIN
// Telas de cadastro e entrada, e a validação dos dados. Tudo demonstrativo:
// nenhuma senha é salva ou enviada.

function hasStrongPassword(password) {
  return password.length >= 8
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}

function renderSignup() {
  return `
    <section class="signup-layout" aria-labelledby="signup-title"><div class="signup-intro"><p class="eyebrow">BEM-VINDE AO EDUSINAL</p><h2>Aprender Libras pode aproximar todo mundo.</h2><p>Crie seu perfil de aluno e comece uma jornada de aprendizagem no seu ritmo.</p><div class="signup-aside"><span aria-hidden="true">✳</span><span>Cadastro demonstrativo: não há autenticação conectada e os dados não são enviados.</span></div></div><div class="signup-form-panel"><div class="signup-title"><span class="eyebrow">CRIAR PERFIL</span><h3 id="signup-title">Dados do aluno</h3></div><form id="signup-form" novalidate><div class="form-grid"><label class="field-label" for="signup-name">Nome completo<input id="signup-name" name="name" autocomplete="name" placeholder="Seu nome" required /></label><label class="field-label" for="signup-age">Idade<input id="signup-age" name="age" type="number" inputmode="numeric" min="1" max="120" step="1" placeholder="Idade em anos" required /></label><label class="field-label" for="signup-email">Gmail<input id="signup-email" name="email" type="email" autocomplete="email" placeholder="voce@gmail.com" required /></label><label class="field-label" for="signup-password">Senha<input id="signup-password" name="password" type="password" autocomplete="new-password" placeholder="Crie uma senha" required /></label><label class="field-label signup-field-full" for="signup-confirm-password">Confirme a senha<input id="signup-confirm-password" name="passwordConfirmation" type="password" autocomplete="new-password" placeholder="Digite a senha novamente" required /></label></div><p class="field-hint">Use ao menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo.</p><p class="form-error" id="form-error" role="alert" aria-live="polite"></p><button class="button button-primary button-full" type="submit">Criar perfil de demonstração <span aria-hidden="true">→</span></button><p class="form-legal">A idade não é verificada e a senha não será salva nem enviada.</p><div class="login-register"><span>Já tem uma conta?</span><button class="text-button" type="button" data-screen="login">Entrar <span aria-hidden="true">→</span></button></div></form></div></section>`;
}

function renderLogin() {
  return `
    <section class="login-layout" aria-labelledby="login-title">
      <div class="signup-intro login-intro">
        <p class="eyebrow">BEM-VINDE DE VOLTA</p>
        <h2 id="login-title">Continue sua jornada no EduSinal.</h2>
        <p>Informe seus dados para validar o acesso demonstrativo.</p>
        <button class="text-button" type="button" data-screen="intro"><span aria-hidden="true">←</span> Voltar ao início</button>
      </div>
      <div class="signup-form-panel login-panel">
        <div class="signup-title"><span class="eyebrow">ACESSO</span><h3>Entrar na sua conta</h3></div>
        <form id="login-form" novalidate>
          <label class="field-label" for="login-name">Nome completo<input id="login-name" name="name" autocomplete="name" placeholder="Seu nome" required /></label>
          <label class="field-label" for="login-age">Idade<input id="login-age" name="age" type="number" inputmode="numeric" min="1" max="120" step="1" placeholder="Idade em anos" required /></label>
          <label class="field-label" for="login-email">Gmail<input id="login-email" name="email" type="email" autocomplete="username" placeholder="voce@gmail.com" required /></label>
          <label class="field-label" for="login-password">Senha<input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Sua senha" required /></label>
          <p class="field-hint">Use ao menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo.</p>
          <p class="form-error" id="login-message" role="status" aria-live="polite"></p>
          <button class="button button-primary button-full" type="submit">Entrar <span aria-hidden="true">→</span></button>
        </form>
        <p class="form-legal">Protótipo demonstrativo: a autenticação não está conectada. Os dados não serão salvos nem enviados.</p>
        <div class="login-register"><span>Ainda não tem conta?</span><button class="text-button" type="button" data-screen="signup">Criar cadastro <span aria-hidden="true">→</span></button></div>
      </div>
    </section>`;
}

// Confere os campos de cadastro ou login. Devolve o texto do erro,
// ou "" quando está tudo certo. Cadastro também confere a confirmação de senha.
function validateAccountForm(form, { confirmPassword = false } = {}) {
  const name = form.elements.name.value.trim();
  const age = Number(form.elements.age.value);
  const email = form.elements.email.value.trim().toLowerCase();
  const password = form.elements.password.value;

  if (name.length < 3) return "Informe seu nome completo (pelo menos 3 caracteres).";
  if (!Number.isInteger(age) || age < 1 || age > 120) return "Informe uma idade válida entre 1 e 120 anos.";
  if (!form.elements.email.validity.valid || !email.endsWith("@gmail.com")) return "Informe um endereço válido terminado em @gmail.com.";
  if (!hasStrongPassword(password)) return "A senha precisa ter 8 caracteres, maiúscula, minúscula, número e símbolo.";
  if (confirmPassword && password !== form.elements.passwordConfirmation.value) return "As senhas não conferem.";
  return "";
}

function handleLoginSubmit(form) {
  const message = document.getElementById("login-message");
  const error = validateAccountForm(form);
  message.classList.toggle("is-success", !error);
  if (error) {
    message.textContent = error;
    return;
  }
  message.textContent = "Dados válidos. A autenticação ainda não está conectada; nada foi enviado ou salvo.";
  form.elements.password.value = "";
}

function handleSignupSubmit(form) {
  const errorBox = document.getElementById("form-error");
  const error = validateAccountForm(form, { confirmPassword: true });
  errorBox.textContent = error;
  if (error) return;

  state.name = form.elements.name.value.trim().split(" ")[0];
  state.isRegistered = true;
  state.isMinor = Number(form.elements.age.value) < 18;
  persist();
  showToast("Perfil de demonstração criado neste navegador.");
  setScreen("trail");
}
