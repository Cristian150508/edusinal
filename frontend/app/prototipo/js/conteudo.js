// CONTEÚDO DAS ETAPAS
// Cada etapa tem 5 atividades e uma prova final. A 1ª e a 3ª são para
// APRENDER (cartões com sinais novos, sem gastar vidas); a 2ª, a 4ª e a 5ª
// são EXERCÍCIOS. Para mudar ou criar conteúdo, é só editar as listas abaixo.
//
// Atividade de aprender (kind: "learn"):
//   cards  sinais apresentados: { sign: "Oi", tip: "quando usar" }
//
// Exercício (kind: "practice"), cada pergunta tem um "type":
//   "video-palavra"  mostra o vídeo de "sign"; o aluno escolhe a palavra (options)
//   "palavra-video"  mostra a palavra "sign"; o aluno escolhe o vídeo (options são sinais)
//   "situacao"       pergunta em texto (q) com respostas em texto (options)
//   "vf"             frase (q) para marcar verdadeiro ou falso (answer: true/false)
// Nos tipos com opções, "answer" é a posição da certa (a primeira é 0).
// "explain" aparece depois de conferir.
//
// Os vídeos dos sinais ainda serão gravados (veja SIGN_VIDEOS). As dicas falam
// de quando usar cada sinal, sem descrever como ele é feito. Antes de publicar,
// o conteúdo deve ser revisado por pessoas surdas fluentes em Libras.

// Vídeo de cada sinal. Quando um vídeo for gravado, coloque o caminho aqui,
// por exemplo: "Oi": "../../assets/videos/oi.mp4". Sem vídeo, aparece um espaço reservado.
const SIGN_VIDEOS = {};

const learningTopics = {
  "primeiros-sinais": {
    number: "01",
    title: "Primeiros sinais",
    subtitle: "Saudações do dia a dia",
    branches: [
      {
        id: "cumprimentos", kind: "learn", icon: "emoji-smile", label: "Oi e tchau", hint: "Aprender · 3 sinais",
        cards: [
          { sign: "Oi", tip: "Para cumprimentar alguém, em qualquer hora do dia." },
          { sign: "Tchau", tip: "Para se despedir. Faça o sinal onde a pessoa possa ver." },
          { sign: "Tudo bem?", tip: "Pergunta comum logo depois do “oi”." },
        ],
      },
      {
        id: "pratica-cumprimentos", kind: "practice", icon: "pencil-square", label: "Pratique: oi e tchau", hint: "4 exercícios",
        questions: [
          { type: "video-palavra", sign: "Oi", options: ["Tchau", "Oi", "Tudo bem?"], answer: 1, explain: "Esse é o sinal de “oi”, para cumprimentar." },
          { type: "palavra-video", sign: "Tchau", options: ["Tudo bem?", "Oi", "Tchau"], answer: 2, explain: "“Tchau” é a despedida do dia a dia." },
          { type: "situacao", q: "Uma pessoa surda está de costas e você quer falar com ela. O que é mais adequado?", options: ["Gritar o nome dela", "Bater palmas atrás dela", "Tocar de leve no ombro ou acenar onde ela possa ver"], answer: 2, explain: "Um toque leve no ombro ou um aceno no campo de visão são formas respeitosas de chamar a atenção." },
          { type: "vf", q: "Libras é o português feito com as mãos.", answer: false, explain: "Libras tem vocabulário, gramática e regras próprias, independentes do português." },
        ],
      },
      {
        id: "saudacoes", kind: "learn", icon: "brightness-high-fill", label: "Bom dia", hint: "Aprender · 3 sinais",
        cards: [
          { sign: "Bom dia", tip: "Saudação até o meio-dia." },
          { sign: "Boa tarde", tip: "Do meio-dia até o anoitecer." },
          { sign: "Boa noite", tip: "À noite, tanto ao chegar quanto ao se despedir." },
        ],
      },
      {
        id: "pratica-saudacoes", kind: "practice", icon: "pencil-square", label: "Pratique: saudações", hint: "4 exercícios",
        questions: [
          { type: "video-palavra", sign: "Boa tarde", options: ["Boa tarde", "Bom dia", "Boa noite"], answer: 0, explain: "Esse é o sinal de “boa tarde”." },
          { type: "situacao", q: "Você chega na escola às 7h e encontra a turma. Qual saudação combina?", options: ["Boa noite", "Bom dia", "Boa tarde"], answer: 1, explain: "Até o meio-dia, a saudação é “bom dia”." },
          { type: "palavra-video", sign: "Boa noite", options: ["Bom dia", "Boa noite", "Boa tarde"], answer: 1, explain: "“Boa noite” serve para chegar e para se despedir à noite." },
          { type: "vf", q: "Às 15h, a saudação certa é “bom dia”.", answer: false, explain: "Do meio-dia até o anoitecer, usamos “boa tarde”." },
        ],
      },
      {
        id: "revisao-saudacoes", kind: "practice", icon: "arrow-repeat", label: "Revisão", hint: "4 exercícios",
        questions: [
          { type: "palavra-video", sign: "Bom dia", options: ["Bom dia", "Tchau", "Boa tarde", "Oi"], answer: 0, explain: "Esse é o sinal de “bom dia”." },
          { type: "situacao", q: "Qual atitude ajuda a manter uma conversa em Libras?", options: ["Desviar o olhar enquanto a outra pessoa sinaliza", "Manter contato visual durante a conversa", "Falar mais alto para facilitar"], answer: 1, explain: "Em uma língua visual, o contato visual mostra atenção e ajuda a acompanhar a conversa." },
          { type: "video-palavra", sign: "Tchau", options: ["Oi", "Boa noite", "Tchau"], answer: 2, explain: "Esse é o sinal de “tchau”." },
          { type: "vf", q: "Na Libras, as expressões do rosto fazem parte da língua.", answer: true, explain: "Expressões faciais e corporais fazem parte da gramática da Libras e podem mudar o sentido." },
        ],
      },
    ],
  },

  "apresentacoes": {
    number: "02",
    title: "Apresentações",
    subtitle: "Seu nome e novas conexões",
    branches: [
      {
        id: "meu-nome", kind: "learn", icon: "tag-fill", label: "Meu nome", hint: "Aprender · 3 sinais",
        cards: [
          { sign: "Nome", tip: "Para perguntar e dizer o nome. Sem sinal-nome, soletre com o alfabeto manual." },
          { sign: "Sinal-nome", tip: "Sinal que identifica uma pessoa. Costuma ser dado por pessoas surdas da comunidade." },
          { sign: "Prazer", tip: "Para fechar a apresentação: prazer em conhecer." },
        ],
      },
      {
        id: "pratica-nome", kind: "practice", icon: "pencil-square", label: "Pratique: meu nome", hint: "4 exercícios",
        questions: [
          { type: "video-palavra", sign: "Nome", options: ["Prazer", "Nome", "Sinal-nome"], answer: 1, explain: "Esse é o sinal de “nome”." },
          { type: "situacao", q: "Você ainda não tem um sinal para o seu nome. Como se apresenta?", options: ["Soletrando o nome com o alfabeto manual", "Escrevendo no ar com o dedo", "Não dá para se apresentar"], answer: 0, explain: "Antes de ter um sinal-nome, a pessoa soletra o próprio nome com a datilologia." },
          { type: "vf", q: "O sinal-nome costuma ser dado por pessoas surdas da comunidade.", answer: true, explain: "Na cultura surda, o sinal-nome costuma ser dado por pessoas surdas, muitas vezes ligado a uma característica da pessoa." },
          { type: "palavra-video", sign: "Prazer", options: ["Prazer", "Nome", "Oi"], answer: 0, explain: "“Prazer em conhecer” fecha bem uma apresentação." },
        ],
      },
      {
        id: "idade-lugar", kind: "learn", icon: "geo-alt-fill", label: "Idade e lugar", hint: "Aprender · 3 sinais",
        cards: [
          { sign: "Idade", tip: "Para perguntar e dizer quantos anos: a resposta usa os sinais dos números." },
          { sign: "Morar", tip: "Para dizer onde você mora." },
          { sign: "Cidade", tip: "Muitas cidades têm sinal próprio, criado pela comunidade surda local." },
        ],
      },
      {
        id: "pratica-idade-lugar", kind: "practice", icon: "pencil-square", label: "Pratique: idade e lugar", hint: "4 exercícios",
        questions: [
          { type: "palavra-video", sign: "Cidade", options: ["Morar", "Idade", "Cidade"], answer: 2, explain: "Esse é o sinal de “cidade”." },
          { type: "situacao", q: "Você não sabe o sinal de um número. O que fazer?", options: ["Desistir da conversa", "Falar mais alto", "Mostrar o número de outro jeito e perguntar o sinal"], answer: 2, explain: "Mostrar o número (nos dedos ou por escrito) e perguntar o sinal é um ótimo jeito de aprender." },
          { type: "video-palavra", sign: "Morar", options: ["Morar", "Cidade", "Nome"], answer: 0, explain: "Esse é o sinal de “morar”." },
          { type: "vf", q: "Cada país tem a sua própria língua de sinais.", answer: true, explain: "O Brasil usa a Libras; Portugal, por exemplo, usa a Língua Gestual Portuguesa." },
        ],
      },
      {
        id: "revisao-apresentacoes", kind: "practice", icon: "arrow-repeat", label: "Revisão", hint: "4 exercícios",
        questions: [
          { type: "situacao", q: "Durante uma apresentação em Libras, para onde olhar?", options: ["Para o chão", "Para o rosto e as mãos de quem sinaliza", "Para o celular"], answer: 1, explain: "Rosto e mãos carregam a mensagem: olhar para eles é acompanhar a conversa." },
          { type: "video-palavra", sign: "Sinal-nome", options: ["Nome", "Sinal-nome", "Prazer"], answer: 1, explain: "Esse é o sinal de “sinal-nome”." },
          { type: "vf", q: "Nomes de cidades sempre precisam ser soletrados em Libras.", answer: false, explain: "Muitas cidades têm sinal próprio. Se você não souber, aí sim soletre." },
          { type: "palavra-video", sign: "Idade", options: ["Cidade", "Idade", "Morar", "Nome"], answer: 1, explain: "Esse é o sinal de “idade”." },
        ],
      },
    ],
  },

  "pessoas-familia": {
    number: "03",
    title: "Pessoas e família",
    subtitle: "Quem faz parte da sua vida",
    branches: [
      {
        id: "familia", kind: "learn", icon: "house-heart-fill", label: "Família", hint: "Aprender · 4 sinais",
        cards: [
          { sign: "Mãe", tip: "Muitas crianças surdas nascem em famílias ouvintes: quando a família aprende Libras, a conversa em casa fica mais fácil." },
          { sign: "Pai", tip: "Também está no tema família do dicionário." },
          { sign: "Irmão", tip: "Para falar do irmão." },
          { sign: "Irmã", tip: "Para falar da irmã." },
        ],
      },
      {
        id: "pratica-familia", kind: "practice", icon: "pencil-square", label: "Pratique: família", hint: "4 exercícios",
        questions: [
          { type: "video-palavra", sign: "Mãe", options: ["Pai", "Irmã", "Mãe"], answer: 2, explain: "Esse é o sinal de “mãe”." },
          { type: "palavra-video", sign: "Irmã", options: ["Irmã", "Irmão", "Pai"], answer: 0, explain: "Esse é o sinal de “irmã”." },
          { type: "situacao", q: "Muitas pessoas surdas nascem em famílias ouvintes. Quando a família aprende Libras…", options: ["A comunicação em casa fica mais fácil", "Não faz diferença", "Atrapalha o aprendizado"], answer: 0, explain: "Uma língua em comum aproxima a família e ajuda no desenvolvimento da criança surda." },
          { type: "vf", q: "“Pai” e “mãe” estão no mesmo tema do dicionário.", answer: true, explain: "Os dois estão no tema família, junto com irmão, irmã e avó." },
        ],
      },
      {
        id: "pessoas", kind: "learn", icon: "people-fill", label: "Amigos e pessoas", hint: "Aprender · 3 sinais",
        cards: [
          { sign: "Amigo", tip: "Para falar de colegas e da turma." },
          { sign: "Eu", tip: "Para falar de si mesmo." },
          { sign: "Você", tip: "Para falar com a pessoa que está conversando com você." },
        ],
      },
      {
        id: "pratica-pessoas", kind: "practice", icon: "pencil-square", label: "Pratique: pessoas", hint: "4 exercícios",
        questions: [
          { type: "palavra-video", sign: "Amigo", options: ["Você", "Amigo", "Eu"], answer: 1, explain: "Esse é o sinal de “amigo”." },
          { type: "situacao", q: "Dois colegas conversam em Libras e você precisa passar. O que é mais educado?", options: ["Passar no meio dos dois", "Esperar uma pausa ou passar por trás, pedindo licença", "Interromper com um grito"], answer: 1, explain: "Passar entre duas pessoas que sinalizam corta a conversa; espere ou peça licença." },
          { type: "video-palavra", sign: "Você", options: ["Eu", "Amigo", "Você"], answer: 2, explain: "Esse é o sinal de “você”." },
          { type: "vf", q: "Numa roda de conversa em Libras, ficar em círculo ajuda todo mundo a se ver.", answer: true, explain: "Em círculo, todos enxergam as mãos e o rosto de quem está sinalizando." },
        ],
      },
      {
        id: "revisao-pessoas", kind: "practice", icon: "flower1", label: "Respeito", hint: "4 exercícios",
        questions: [
          { type: "situacao", q: "Qual termo é o mais adequado hoje?", options: ["Surdo-mudo", "Mudinho", "Surdo ou pessoa surda"], answer: 2, explain: "“Surdo-mudo” é incorreto: pessoas surdas têm voz e podem falar; muitas preferem se comunicar em Libras." },
          { type: "video-palavra", sign: "Irmão", options: ["Irmão", "Amigo", "Pai"], answer: 0, explain: "Esse é o sinal de “irmão”." },
          { type: "vf", q: "Descrever como uma pessoa é e zombar dela são a mesma coisa.", answer: false, explain: "Descrever é diferente de caçoar: foque nas características, com respeito." },
          { type: "situacao", q: "Qual lei reconheceu a Libras como meio legal de comunicação no Brasil?", options: ["Lei nº 10.436/2002", "Lei Áurea", "Constituição de 1824"], answer: 0, explain: "A Lei nº 10.436, de 2002, reconheceu a Libras; o Decreto nº 5.626, de 2005, a regulamentou." },
        ],
      },
    ],
  },
};

// Ordem das etapas: uma só abre depois que a anterior for concluída.
const TOPIC_ORDER = Object.keys(learningTopics);

// A prova final pode ter no máximo este número de erros para passar.
const FINAL_MAX_MISTAKES = 1;

// ----- Progresso das lições (salvo no navegador) -----

function lessonKey(topicId, branchId) {
  return `${topicId}:${branchId}`;
}

function isLessonDone(topicId, branchId) {
  return state.completedLessons.includes(lessonKey(topicId, branchId));
}

// Quantas das 5 atividades desta etapa já foram concluídas.
function doneBranchCount(topicId) {
  return learningTopics[topicId].branches.filter((branch) => isLessonDone(topicId, branch.id)).length;
}

// A prova final só abre quando todas as atividades estão concluídas.
function isFinalUnlocked(topicId) {
  return doneBranchCount(topicId) === learningTopics[topicId].branches.length;
}

// A primeira etapa está sempre aberta; as outras abrem com a prova da anterior.
function isTopicUnlocked(topicId) {
  const position = TOPIC_ORDER.indexOf(topicId);
  return position === 0 || isLessonDone(TOPIC_ORDER[position - 1], "final");
}

// Etapa em que o aluno está: a primeira cuja prova final ainda não foi feita.
function currentTopicId() {
  return TOPIC_ORDER.find((id) => !isLessonDone(id, "final")) || TOPIC_ORDER[TOPIC_ORDER.length - 1];
}

// Marca a lição como concluída. Devolve true se foi a primeira vez.
function markLessonDone(topicId, branchId) {
  if (isLessonDone(topicId, branchId)) return false;
  state.completedLessons.push(lessonKey(topicId, branchId));
  persist();
  return true;
}

// Progresso salvo antes da mudança das atividades (25/10) usa nomes que não
// existem mais. Aqui jogamos fora os nomes antigos e, se a prova final da
// etapa já foi feita, marcamos todas as atividades dela como feitas também.
function fixOldProgress() {
  const fixed = [];
  TOPIC_ORDER.forEach((topicId) => {
    const finalDone = isLessonDone(topicId, "final");
    learningTopics[topicId].branches.forEach((branch) => {
      if (finalDone || isLessonDone(topicId, branch.id)) fixed.push(lessonKey(topicId, branch.id));
    });
    if (finalDone) fixed.push(lessonKey(topicId, "final"));
  });
  if (fixed.length === state.completedLessons.length && fixed.every((key) => state.completedLessons.includes(key))) return;
  state.completedLessons = fixed;
  persist();
}
fixOldProgress();

// Passos de uma atividade: os cartões (aprender, com type "card") ou as perguntas (exercício).
// A prova final junta as 2 primeiras perguntas de cada exercício da etapa.
function stepsFor(topicId, branchId) {
  const topic = learningTopics[topicId];
  if (branchId === "final") {
    return topic.branches
      .filter((branch) => branch.kind === "practice")
      .flatMap((branch) => branch.questions.slice(0, 2));
  }
  const branch = topic.branches.find((entry) => entry.id === branchId);
  return branch.kind === "learn" ? branch.cards.map((card) => ({ type: "card", ...card })) : branch.questions;
}

// Tipo da atividade: "learn" (aprender) ou "practice" (exercício; a prova final também).
function activityKind(topicId, branchId) {
  if (branchId === "final") return "practice";
  return learningTopics[topicId].branches.find((branch) => branch.id === branchId).kind;
}
