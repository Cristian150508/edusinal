// CONTEÚDO DAS ETAPAS
// Etapas da trilha, os 5 galhos (exercícios) de cada uma e as perguntas.
// Para mudar ou criar perguntas, é só editar as listas abaixo.
//
// Cada pergunta:
//   q        texto da pergunta
//   options  respostas possíveis (2 a 4)
//   answer   posição da resposta certa na lista (a primeira é 0)
//   explain  explicação mostrada depois de conferir
// O "icon" de cada galho é o nome de um ícone do Bootstrap Icons (icons.getbootstrap.com).
//
// Enquanto não há vídeos dos sinais, as perguntas tratam de situações,
// cultura surda e uso da língua — sem descrever como se faz cada sinal.
// Antes de publicar, o conteúdo deve ser revisado por pessoas surdas fluentes.

const learningTopics = {
  "primeiros-sinais": {
    number: "01",
    title: "Primeiros sinais",
    subtitle: "Saudações do dia a dia",
    branches: [
      {
        id: "alfabeto", icon: "alphabet-uppercase", label: "Alfabeto", hint: "Letras em Libras",
        questions: [
          { q: "Para que serve o alfabeto manual (datilologia)?", options: ["Para soletrar nomes e palavras que ainda não têm sinal", "Para substituir todos os sinais da Libras", "Só para escrever no papel"], answer: 0, explain: "A datilologia soletra letra por letra. É usada em nomes próprios e em palavras sem sinal conhecido." },
          { q: "Libras é o português feito com as mãos?", options: ["Sim, cada palavra vira um gesto", "Não: é uma língua com gramática própria", "Só quando é escrita"], answer: 1, explain: "Libras tem vocabulário, gramática e regras próprias, independentes do português." },
        ],
      },
      {
        id: "oi-tchau", icon: "emoji-smile", label: "Oi e tchau", hint: "Cumprimentos",
        questions: [
          { q: "Uma pessoa surda está de costas e você quer falar com ela. O que é mais adequado?", options: ["Gritar o nome dela", "Bater palmas atrás dela", "Tocar de leve no ombro ou acenar onde ela possa ver"], answer: 2, explain: "Um toque leve no ombro ou um aceno no campo de visão são formas respeitosas de chamar a atenção." },
          { q: "No fim da aula, ao se despedir de um colega, qual palavra combina?", options: ["Tchau", "Bom dia", "Por favor"], answer: 0, explain: "“Tchau” é a despedida do dia a dia." },
        ],
      },
      {
        id: "bom-dia", icon: "brightness-high-fill", label: "Bom dia", hint: "Saudações do dia",
        questions: [
          { q: "Você chega na escola às 7h e encontra a turma. Qual saudação combina?", options: ["Boa noite", "Bom dia", "Boa tarde"], answer: 1, explain: "Até o meio-dia, a saudação é “bom dia”." },
          { q: "E às 15h, ao chegar no curso?", options: ["Bom dia", "Boa noite", "Boa tarde"], answer: 2, explain: "Do meio-dia até o anoitecer, usamos “boa tarde”." },
        ],
      },
      {
        id: "por-favor", icon: "chat-heart", label: "Por favor", hint: "Gentileza",
        questions: [
          { q: "Qual atitude ajuda a manter uma conversa em Libras?", options: ["Desviar o olhar enquanto a outra pessoa sinaliza", "Manter contato visual durante a conversa", "Falar mais alto para facilitar"], answer: 1, explain: "Em uma língua visual, o contato visual mostra atenção e ajuda a acompanhar a conversa." },
          { q: "Você não entendeu um sinal. O que é mais educado?", options: ["Pedir, por favor, para a pessoa repetir", "Fingir que entendeu", "Mudar de assunto"], answer: 0, explain: "Pedir para repetir é normal e mostra interesse na conversa." },
        ],
      },
      {
        id: "obrigado", icon: "heart-fill", label: "Obrigado(a)", hint: "Agradecer",
        questions: [
          { q: "Um colega te ajudou com a lição. O que você diz?", options: ["Desculpa", "Tchau", "Obrigado(a)"], answer: 2, explain: "Agradecer é um dos primeiros sinais que vale aprender." },
          { q: "Na Libras, as expressões do rosto…", options: ["Não importam", "Fazem parte da língua e podem mudar o sentido", "Devem ser evitadas"], answer: 1, explain: "Expressões faciais e corporais fazem parte da gramática da Libras." },
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
        id: "meu-nome", icon: "pencil", label: "Meu nome", hint: "Soletrar o nome",
        questions: [
          { q: "Você ainda não tem um sinal para o seu nome. Como se apresenta?", options: ["Soletrando o nome com o alfabeto manual", "Escrevendo no ar com o dedo", "Não dá para se apresentar"], answer: 0, explain: "Antes de ter um sinal-nome, a pessoa soletra o próprio nome com a datilologia." },
          { q: "Na datilologia, cada configuração de mão representa…", options: ["Uma palavra inteira", "Uma letra", "Uma frase"], answer: 1, explain: "Cada configuração corresponde a uma letra; juntas, elas formam a palavra." },
        ],
      },
      {
        id: "sinal-nome", icon: "tag-fill", label: "Sinal-nome", hint: "Seu nome em Libras",
        questions: [
          { q: "O que é o sinal-nome?", options: ["O nome escrito em português", "Um sinal que identifica uma pessoa", "Um apelido falado em voz alta"], answer: 1, explain: "O sinal-nome identifica a pessoa sem precisar soletrar o nome toda vez." },
          { q: "Quem costuma dar o sinal-nome a alguém?", options: ["Pessoas surdas da comunidade", "A própria pessoa, sozinha", "O professor de português"], answer: 0, explain: "Na cultura surda, o sinal-nome costuma ser dado por pessoas surdas, muitas vezes ligado a uma característica da pessoa." },
        ],
      },
      {
        id: "prazer", icon: "person-plus-fill", label: "Prazer!", hint: "Conhecer alguém",
        questions: [
          { q: "Depois de ser apresentado a alguém, o que costuma vir?", options: ["Boa noite", "Desculpa", "Prazer em conhecer"], answer: 2, explain: "“Prazer em conhecer” fecha bem uma apresentação." },
          { q: "Durante uma apresentação em Libras, para onde olhar?", options: ["Para o chão", "Para o rosto e as mãos de quem sinaliza", "Para o celular"], answer: 1, explain: "Rosto e mãos carregam a mensagem: olhar para eles é acompanhar a conversa." },
        ],
      },
      {
        id: "idade", icon: "cake2-fill", label: "Idade", hint: "Quantos anos?",
        questions: [
          { q: "Para dizer quantos anos você tem, que tipo de sinal você usa?", options: ["Números", "Cores", "Saudações"], answer: 0, explain: "Idade se diz com os sinais dos números." },
          { q: "Você não sabe o sinal de um número. O que fazer?", options: ["Desistir da conversa", "Falar mais alto", "Mostrar o número de outro jeito e perguntar o sinal"], answer: 2, explain: "Mostrar o número (nos dedos ou por escrito) e perguntar o sinal é um ótimo jeito de aprender." },
        ],
      },
      {
        id: "onde-moro", icon: "geo-alt-fill", label: "Onde moro", hint: "Cidade e bairro",
        questions: [
          { q: "Nomes de cidades em Libras…", options: ["Sempre são soletrados", "Muitas vezes têm sinal próprio; se não souber, soletre", "Não podem ser ditos"], answer: 1, explain: "Muitas cidades têm sinal próprio, criado pela comunidade surda local." },
          { q: "A Libras é a língua de sinais de qual país?", options: ["De todos os países", "Do Brasil", "De Portugal"], answer: 1, explain: "Cada país tem sua língua de sinais. Portugal, por exemplo, usa a Língua Gestual Portuguesa." },
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
        id: "familia", icon: "house-heart-fill", label: "Família", hint: "Mãe, pai e irmãos",
        questions: [
          { q: "Qual destas palavras é da família?", options: ["Azul", "Mãe", "Bom dia"], answer: 1, explain: "Mãe, pai, irmão e avó estão no tema família do dicionário." },
          { q: "Muitas pessoas surdas nascem em famílias ouvintes. Quando a família aprende Libras…", options: ["A comunicação em casa fica mais fácil", "Não faz diferença", "Atrapalha o aprendizado"], answer: 0, explain: "Uma língua em comum aproxima a família e ajuda no desenvolvimento da criança surda." },
        ],
      },
      {
        id: "amigos", icon: "people-fill", label: "Amigos", hint: "Turma e colegas",
        questions: [
          { q: "Dois colegas conversam em Libras e você precisa passar. O que é mais educado?", options: ["Passar no meio dos dois", "Esperar uma pausa ou passar por trás, pedindo licença", "Interromper com um grito"], answer: 1, explain: "Passar entre duas pessoas que sinalizam corta a conversa; espere ou peça licença." },
          { q: "Em uma roda de conversa em Libras, qual formação ajuda todo mundo?", options: ["Em fila", "De costas", "Em círculo, para todos se verem"], answer: 2, explain: "Em círculo, todos enxergam as mãos e o rosto de quem está sinalizando." },
        ],
      },
      {
        id: "apontar", icon: "hand-index-fill", label: "Apontar", hint: "Eu, você, ele",
        questions: [
          { q: "Em Libras, para falar de uma pessoa que está presente, é comum…", options: ["Apontar para ela", "Soletrar “ele”", "Fechar os olhos"], answer: 0, explain: "A apontação funciona como pronome: aponta-se para a pessoa de quem se fala." },
          { q: "E quando a pessoa não está presente?", options: ["Não dá para falar dela", "Só por escrito", "Marca-se um ponto no espaço para representá-la"], answer: 2, explain: "O espaço à frente de quem sinaliza é usado para marcar pessoas e lugares durante a conversa." },
        ],
      },
      {
        id: "descrever", icon: "person-bounding-box", label: "Descrever", hint: "Como a pessoa é",
        questions: [
          { q: "Para descrever a aparência de alguém, a Libras usa muito…", options: ["O espaço e a forma das mãos", "Só a datilologia", "Só a voz"], answer: 0, explain: "A forma e o movimento das mãos no espaço ajudam a mostrar tamanho, formato e jeito." },
          { q: "Ao descrever uma pessoa, o que é respeitoso?", options: ["Imitar de forma exagerada", "Falar das características sem zombar", "Apontar e rir"], answer: 1, explain: "Descrever é diferente de caçoar: foque nas características com respeito." },
        ],
      },
      {
        id: "respeito", icon: "flower1", label: "Respeito", hint: "Cultura surda",
        questions: [
          { q: "Qual termo é o mais adequado hoje?", options: ["Surdo-mudo", "Mudinho", "Surdo ou pessoa surda"], answer: 2, explain: "“Surdo-mudo” é incorreto: pessoas surdas têm voz e podem falar; muitas preferem se comunicar em Libras." },
          { q: "Qual lei reconheceu a Libras como meio legal de comunicação no Brasil?", options: ["Lei nº 10.436/2002", "Lei Áurea", "Constituição de 1824"], answer: 0, explain: "A Lei nº 10.436, de 2002, reconheceu a Libras; o Decreto nº 5.626, de 2005, a regulamentou." },
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

// Quantos dos 5 galhos desta etapa já foram concluídos.
function doneBranchCount(topicId) {
  return learningTopics[topicId].branches.filter((branch) => isLessonDone(topicId, branch.id)).length;
}

// A prova final só abre quando todos os galhos estão concluídos.
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

// Perguntas de um galho; a prova final junta a primeira pergunta de cada galho.
function questionsFor(topicId, branchId) {
  const topic = learningTopics[topicId];
  if (branchId === "final") return topic.branches.map((branch) => branch.questions[0]);
  return topic.branches.find((branch) => branch.id === branchId).questions;
}
