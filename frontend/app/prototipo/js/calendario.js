// CALENDÁRIO DA OFENSIVA
// Janela que abre ao tocar no foguinho (barra de cima do celular ou Perfil).
// Mostra o mês com os dias em que o aluno praticou (fogo) e os dias salvos
// pelo protetor de ofensiva (escudo). Dá para voltar aos meses anteriores.

const WEEKDAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"]; // começa na segunda
const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Mês mostrado: 0 = este mês, -1 = mês passado, e assim por diante.
let calendarMonthOffset = 0;

function renderCalendarDay(date) {
  const key = dateKey(date);
  const isToday = key === dateKey();
  const isFuture = key > dateKey();
  let status = "";
  let symbol = "";
  let label = `${date.getDate()}`;
  if (state.practiceDays.includes(key)) {
    status = " is-practiced";
    symbol = icon("fire");
    label += ", praticou";
  } else if (state.frozenDays.includes(key)) {
    status = " is-frozen";
    symbol = icon("shield-fill-check");
    label += ", salvo pelo protetor";
  }
  const classes = `calendar-day${status}${isToday ? " is-today" : ""}${isFuture ? " is-future" : ""}`;
  return `<span class="${classes}" role="gridcell" aria-label="${label}${isToday ? ", hoje" : ""}">${symbol || date.getDate()}</span>`;
}

function renderStreakCalendar() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth() + calendarMonthOffset, 1);
  const daysInMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate();
  const emptyCells = (firstDay.getDay() + 6) % 7; // quantos dias antes da 1ª segunda

  const cells = Array.from({ length: emptyCells }, () => '<span class="calendar-day is-empty" aria-hidden="true"></span>');
  let practicedCount = 0;
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), day);
    if (state.practiceDays.includes(dateKey(date))) practicedCount += 1;
    cells.push(renderCalendarDay(date));
  }

  const monthName = `${MONTH_NAMES[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
  const isCurrentMonth = calendarMonthOffset === 0;
  return `
    <div class="calendar-month">
      <button class="calendar-nav" type="button" data-action="calendar-month" data-step="-1" aria-label="Mês anterior">${icon("chevron-left")}</button>
      <strong>${monthName}</strong>
      <button class="calendar-nav" type="button" data-action="calendar-month" data-step="1" aria-label="Próximo mês"${isCurrentMonth ? " disabled" : ""}>${icon("chevron-right")}</button>
    </div>
    <div class="calendar-grid" role="grid" aria-label="Dias de ${monthName}">
      ${WEEKDAY_LABELS.map((letter) => `<span class="calendar-weekday" aria-hidden="true">${letter}</span>`).join("")}
      ${cells.join("")}
    </div>
    <p class="calendar-count">${practicedCount} ${practicedCount === 1 ? "dia praticado" : "dias praticados"} neste mês</p>`;
}

function renderStreakSummary() {
  const practicedToday = state.practiceDays.includes(dateKey());
  const hint = practicedToday ? "Você já praticou hoje. Volte amanhã para continuar!" : "Faça um exercício hoje para manter a ofensiva.";
  return `
    <div class="streak-summary">
      <span class="streak-flame${state.streak > 0 ? " is-lit" : ""}">${icon("fire")}</span>
      <div><strong>${state.streak} ${state.streak === 1 ? "dia" : "dias"} de ofensiva</strong><p>${hint}</p></div>
    </div>`;
}

function fillStreakModal() {
  document.getElementById("streak-body").innerHTML = `
    ${renderStreakSummary()}
    ${renderStreakCalendar()}
    <div class="calendar-legend">
      <span><span class="calendar-day is-practiced" aria-hidden="true">${icon("fire")}</span> Praticou</span>
      <span><span class="calendar-day is-frozen" aria-hidden="true">${icon("shield-fill-check")}</span> Protetor</span>
      <span>${icon("shield-fill-check")} ${state.streakFreezes} ${state.streakFreezes === 1 ? "protetor guardado" : "protetores guardados"}</span>
    </div>`;
}

function openStreakCalendar() {
  if (!window.bootstrap) {
    setScreen("profile"); // sem o Bootstrap, a janela não abre: mostra o Perfil
    return;
  }
  calendarMonthOffset = 0;
  fillStreakModal();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("streak-modal")).show();
}

function changeCalendarMonth(step) {
  calendarMonthOffset = Math.min(0, calendarMonthOffset + step); // não mostra meses futuros
  fillStreakModal();
}
