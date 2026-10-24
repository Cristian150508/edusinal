// ATIVIDADE (LIÇÃO)
// Como uma atividade funciona, pergunta por pergunta:
//   1. o aluno escolhe uma resposta (pode trocar);
//   2. toca em "Conferir": errar gasta uma vida;
//   3. "Continuar" vai para a próxima pergunta; na última, "Concluir".
// Exercício: concluído se chegar ao fim com vidas.
// Prova final: além disso, pode errar no máximo FINAL_MAX_MISTAKES vezes.
// As perguntas ficam em conteudo.js.

function startBranch(topicId, branchId) {
  const index = learningTopics[topicId].branches.findIndex((branch) => branch.id === branchId);
  if (branchId !== "final" && !isBranchUnlocked(topicId, index)) return; // fora de ordem: não começa
  if (branchId === "final" && !isFinalUnlocked(topicId)) return;
  state.currentLesson = {
    topicId,
    branchId,
    questions: questionsFor(topicId, branchId),
    index: 0,        // pergunta atual
    mistakes: 0,     // quantas erradas até agora
    outOfLives: false,
  };
  setScreen("lesson");
}

function currentQuestion() {
  const lesson = state.currentLesson;
  return lesson.questions[lesson.index];
}

function isFinalExam(lesson = state.currentLesson) {
  return lesson.branchId === "final";
}

// Título pequeno da atividade: etapa / exercício (ou prova final).
function lessonEyebrow() {
  const lesson = state.currentLesson;
  const topic = learningTopics[lesson.topicId];
  const name = isFinalExam() ? "Prova final" : topic.branches.find((branch) => branch.id === lesson.branchId).label;
  return `${topic.title.toUpperCase()} <span class="eyebrow-separator">/</span> ${name.toUpperCase()}`;
}

// Recompensa mostrada no topo: refazer algo já concluído é revisão, sem XP.
function lessonRewardLabel() {
  const lesson = state.currentLesson;
  if (isLessonDone(lesson.topicId, lesson.branchId)) return "Revisão · sem XP";
  return `${icon("lightning-charge-fill")} +${XP_PER_EXERCISE} XP`;
}

function renderLesson() {
  const lesson = state.currentLesson;
  const question = currentQuestion();
  const total = lesson.questions.length;
  const progress = Math.round((lesson.index / total) * 100);
  const hint = isFinalExam()
    ? `Prova final: para passar, erre no máximo ${FINAL_MAX_MISTAKES}.`
    : "Escolha a melhor resposta e toque em Conferir.";
  const options = question.options.map((text, position) =>
    `<button class="answer-option" type="button" data-action="select-answer" data-option="${position}" aria-pressed="false">${text}</button>`,
  ).join("");

  return `
    <section class="lesson-wrap">
      <div class="lesson-topline"><button class="back-button" type="button" data-action="leave-lesson" aria-label="Sair da atividade"><i class="bi bi-arrow-left" aria-hidden="true"></i> <span class="back-label">Voltar</span></button><span class="lesson-lives" aria-label="${state.lives} de ${MAX_LIVES} vidas">${livesHeartsHtml()}</span><span class="lesson-xp">${lessonRewardLabel()}</span></div>
      <div class="lesson-progress" role="progressbar" aria-label="Progresso da atividade" aria-valuenow="${lesson.index}" aria-valuemin="0" aria-valuemax="${total}"><span id="lesson-progress-bar" style="width: ${progress}%"></span></div>
      <div class="lesson-content">
        <p class="eyebrow">${lessonEyebrow()} <span class="lesson-count">· ${lesson.index + 1} de ${total}</span></p>
        <h2>${question.q}</h2>
        <p class="lesson-hint">${hint}</p>
        <div class="answer-list" role="group" aria-label="Opções de resposta">${options}</div>
        <div class="answer-feedback" id="answer-feedback" aria-live="polite"></div>
        <button class="button button-primary continue-button" id="lesson-continue" type="button" data-action="check-answer" disabled>Conferir</button>
      </div>
      <p class="demo-disclaimer">Atividade demonstrativa; o conteúdo deve ser revisado por pessoas surdas fluentes em Libras.</p>
    </section>`;
}

// 1º passo: o aluno escolhe uma resposta (pode trocar antes de conferir).
function selectAnswer(clickedButton) {
  if (state.answered) return;
  document.querySelectorAll(".answer-option").forEach((option) => {
    option.classList.toggle("is-selected", option === clickedButton);
    option.setAttribute("aria-pressed", String(option === clickedButton));
  });
  document.getElementById("lesson-continue").disabled = false;
}

// 2º passo: "Conferir" mostra se acertou e decide o que vem depois.
function checkAnswer() {
  const lesson = state.currentLesson;
  const chosen = document.querySelector(".answer-option.is-selected");
  if (state.answered || !chosen) return;
  state.answered = true;

  const question = currentQuestion();
  const isCorrect = Number(chosen.dataset.option) === question.answer;
  if (!isCorrect) {
    lesson.mistakes += 1;
    loseLife();
    const lives = document.querySelector(".lesson-lives");
    lives.innerHTML = livesHeartsHtml();
    lives.setAttribute("aria-label", `${state.lives} de ${MAX_LIVES} vidas`);
  }

  document.querySelectorAll(".answer-option").forEach((option) => {
    option.disabled = true;
    if (Number(option.dataset.option) === question.answer) option.classList.add("is-correct");
    else if (option === chosen) option.classList.add("is-incorrect");
  });
  document.getElementById("lesson-progress-bar").style.width = `${Math.round(((lesson.index + 1) / lesson.questions.length) * 100)}%`;

  const feedback = document.getElementById("answer-feedback");
  feedback.className = `answer-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`;
  feedback.textContent = isCorrect
    ? `Isso! ${question.explain}`
    : `Resposta certa: “${question.options[question.answer]}”. ${question.explain}`;

  // O que o botão faz agora
  const button = document.getElementById("lesson-continue");
  const isLast = lesson.index === lesson.questions.length - 1;
  const failedExam = isFinalExam() && lesson.mistakes > FINAL_MAX_MISTAKES;
  if (!isCorrect && state.lives === 0) {
    lesson.outOfLives = true;
    button.dataset.action = "finish-lesson";
    button.textContent = "Sair";
  } else if (isLast || failedExam) {
    button.dataset.action = "finish-lesson";
    button.textContent = failedExam ? "Ver resultado" : "Concluir";
  } else {
    button.dataset.action = "next-question";
    button.textContent = "Continuar";
  }
}

function nextQuestion() {
  state.currentLesson.index += 1;
  state.answered = false;
  render();
  document.querySelector(".answer-option")?.focus({ preventScroll: true });
}

// Fim da atividade: conclui (e premia na 1ª vez) ou explica por que não passou.
function finishLesson() {
  const lesson = state.currentLesson;
  const failedExam = isFinalExam(lesson) && lesson.mistakes > FINAL_MAX_MISTAKES;

  if (lesson.outOfLives) {
    showToast("Suas vidas acabaram. Elas voltam com o tempo; enquanto isso, revise no dicionário.");
  } else if (failedExam) {
    showToast(`Você errou ${lesson.mistakes}. Na prova, pode errar no máximo ${FINAL_MAX_MISTAKES}. Tente de novo!`);
  } else if (markLessonDone(lesson.topicId, lesson.branchId)) {
    giveActivityReward();
    if (isFinalExam(lesson)) {
      const next = TOPIC_ORDER[TOPIC_ORDER.indexOf(lesson.topicId) + 1];
      showToast(next ? `Etapa concluída! “${learningTopics[next].title}” foi liberada. +${XP_PER_EXERCISE} XP` : `Etapa concluída! +${XP_PER_EXERCISE} XP`);
    }
  } else {
    showToast("Revisão concluída!");
  }

  setScreen("trail");
  openTopic(lesson.topicId);
}

// Sair no meio: volta para a árvore sem concluir (vidas perdidas não voltam).
function leaveLesson() {
  const lesson = state.currentLesson;
  setScreen("trail");
  if (lesson) openTopic(lesson.topicId);
}
