// MISSÕES
// Metas pequenas que dão moedas. As diárias recomeçam à meia-noite e as
// semanais na segunda-feira. O progresso vem do que o aluno faz de verdade.

// progress: função que diz quanto já foi feito.
const DAILY_MISSIONS = [
  { id: "exercicios", icon: "pencil-square", tone: "coral", title: "Conclua 2 exercícios", text: "Faça exercícios novos na árvore da etapa.", target: 2, reward: 10, progress: () => state.daily.exercises },
  { id: "xp", icon: "stars", tone: "yellow", title: "Ganhe 40 XP", text: `Cada exercício novo vale ${XP_PER_EXERCISE} XP.`, target: 40, reward: 10, progress: () => state.daily.xp },
  { id: "dicionario", icon: "book-half", tone: "green", title: "Veja 3 sinais no dicionário", text: "Revisar é livre e não gasta vidas.", target: 3, reward: 5, progress: () => state.daily.signsViewed.length },
];

const WEEKLY_MISSIONS = [
  { id: "xp-semana", icon: "trophy-fill", tone: "blue", title: "Ganhe 200 XP na semana", text: "O mesmo XP que conta para a liga.", target: 200, reward: 30, progress: () => state.week.xp },
  { id: "ofensiva", icon: "fire", tone: "coral", title: "Chegue a 5 dias de ofensiva", text: "Pratique um pouco todos os dias.", target: 5, reward: 20, progress: () => state.streak },
];

function missionList(scope) {
  return scope === "daily" ? DAILY_MISSIONS : WEEKLY_MISSIONS;
}

// Lista de missões já resgatadas (hoje ou nesta semana).
function claimedList(scope) {
  return scope === "daily" ? state.daily.claimed : state.week.claimed;
}

function isMissionComplete(mission) {
  return mission.progress() >= mission.target;
}

// Quantas missões estão prontas esperando o resgate (aparece na Home).
function readyMissionsCount() {
  let count = 0;
  ["daily", "weekly"].forEach((scope) => {
    missionList(scope).forEach((mission) => {
      if (isMissionComplete(mission) && !claimedList(scope).includes(mission.id)) count += 1;
    });
  });
  return count;
}

function claimMission(scope, missionId) {
  const mission = missionList(scope).find((entry) => entry.id === missionId);
  const claimed = claimedList(scope);
  if (!mission || claimed.includes(mission.id) || !isMissionComplete(mission)) return;

  claimed.push(mission.id);
  state.coins += mission.reward;
  persist();
  render();
  showToast(`Missão concluída: +${mission.reward} moedas!`);
}

function renderMissionRow(mission, scope) {
  const value = Math.min(mission.progress(), mission.target);
  const isClaimed = claimedList(scope).includes(mission.id);

  let action = `<span class="mission-reward">+${mission.reward} ${icon("coin")}</span>`;
  if (isClaimed) {
    action = `<span class="mission-claimed">Resgatada ${icon("check-circle-fill")}</span>`;
  } else if (isMissionComplete(mission)) {
    action = `<button class="button button-primary mission-claim" type="button" data-action="claim-mission" data-scope="${scope}" data-mission="${mission.id}">Resgatar +${mission.reward} ${icon("coin")}</button>`;
  }

  return `
    <article class="mission-row${isClaimed ? " is-claimed" : ""}">
      <span class="mission-mark mission-mark-${mission.tone}">${icon(mission.icon)}</span>
      <div class="mission-copy"><h3>${mission.title}</h3><p>${mission.text}</p>${progressBarHtml(value, mission.target, mission.title)}</div>
      <strong class="mission-count">${value} / ${mission.target}</strong>
      ${action}
    </article>`;
}

function renderMissions() {
  const doneToday = DAILY_MISSIONS.filter((mission) => state.daily.claimed.includes(mission.id)).length;
  const hoursLeft = 24 - new Date().getHours();
  return `
    <section class="page-intro"><div><p class="eyebrow">OBJETIVOS</p><h2>Missões</h2><p>Metas pequenas ajudam a criar ritmo. Complete e resgate moedas para a lojinha.</p></div><span class="demo-pill">${doneToday} DE ${DAILY_MISSIONS.length} HOJE</span></section>
    <section class="mission-group" aria-labelledby="daily-missions-title">
      <div class="section-heading"><div><p class="eyebrow">RENOVAM EM ${hoursLeft} H</p><h2 id="daily-missions-title">Missões do dia</h2></div></div>
      <div class="mission-list">${DAILY_MISSIONS.map((mission) => renderMissionRow(mission, "daily")).join("")}</div>
    </section>
    <section class="mission-group" aria-labelledby="weekly-missions-title">
      <div class="section-heading"><div><p class="eyebrow">RENOVAM NA SEGUNDA</p><h2 id="weekly-missions-title">Missões da semana</h2></div></div>
      <div class="mission-list">${WEEKLY_MISSIONS.map((mission) => renderMissionRow(mission, "weekly")).join("")}</div>
    </section>
    <button class="button button-primary" type="button" data-action="open-topic" data-topic="${currentTopicId()}">Praticar agora <i class="bi bi-arrow-right" aria-hidden="true"></i></button>`;
}
