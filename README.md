# EduSinal

Plataforma demonstrativa para aprendizagem de Libras. O protótipo é a experiência principal: tem trilha, árvore de lições com prova final, atividades, vidas, progresso, perfil com mascote personalizável e uma lojinha com moedas fictícias. A interface segue a identidade visual do projeto: azul, turquesa e branco, com tema claro e escuro.

## O que existe hoje

- **Frontend:** HTML, CSS e JavaScript, com [Bootstrap 5.3](https://getbootstrap.com) (avisos e janelas de confirmação) e [Bootstrap Icons](https://icons.getbootstrap.com). Os dois ficam dentro do projeto, em `frontend/assets/vendor/`, então o protótipo funciona sem internet (só as fontes do Google precisam de conexão). A Home abre em `/`; o estado demonstrativo fica no `localStorage` do navegador.
- **Trilha e árvore de lições:** clicar em uma etapa da trilha abre o modo foco: o menu lateral recua e a etapa vira o centro de uma árvore com 5 galhos (exercícios). O centro é a **prova final**: ela só abre depois que os 5 galhos forem concluídos; antes disso, tocar nela apenas volta à trilha. O progresso dos galhos fica salvo no navegador e refazer um galho não dá recompensa de novo. No momento todos os galhos usam a mesma atividade de demonstração.
- **Backend:** Python, FastAPI e MySQL, organizado em controllers, schemas, repositories e services.
- **Vidas:** 3 vidas; cada resposta errada consome uma e uma vida se recupera a cada 30 minutos. Revisar o dicionário continua livre.
- **Recompensas demonstrativas:** uma atividade nova correta concede 20 XP. A primeira dá 15 moedas e libera um broche local no protótipo; cada atividade nova seguinte dá 5 moedas. O inventário ainda não está na API.
- **Abas do aluno:** dicionário com busca e categorias (revisar é livre); ligas semanais com colegas fictícios (os 3 primeiros sobem, os 2 últimos descem); missões do dia e da semana que dão moedas; lojinha com ajudas (recarga de vidas, protetor de ofensiva), acessórios e fundos; perfil com conquistas; e Configurações (engrenagem) com tema, tamanho do texto, animações reduzidas, ajuda, privacidade e conta.
- **Ofensiva:** conta os dias seguidos com pelo menos um exercício novo. Se o aluno ficar dias sem praticar, ela zera, a não ser que tenha protetores de ofensiva.
- **Segurança para menores:** não há chat nem mensagens entre alunos, e as ligas mostram só apelidos.
- **Conta demonstrativa:** o cadastro cria um perfil novo, do zero (com 20 moedas de boas-vindas), salvo só neste navegador. Entrar usa o mesmo e-mail do cadastro; sem servidor, a senha não é conferida. Tema claro/escuro, tamanho do texto e animações ficam em "Configurações → Preferências".
- **Árvore de exercícios:** os 5 exercícios de cada etapa seguem uma ordem (o 2 abre depois do 1, e assim por diante) e a prova final vem por último. No computador eles ficam em espiral, com a prova no centro; no celular, num caminho ondulado só com os ícones: tocar num ícone mostra o título e o botão para começar.
- **Etapas com conteúdo:** 01 Primeiros sinais, 02 Apresentações e 03 Pessoas e família, cada uma com 5 exercícios de 2 perguntas e uma prova final. Uma etapa só abre depois da prova da anterior; a 04 ainda está "em breve". As perguntas tratam de situações, cultura surda e uso da língua (sem descrever sinais) e devem ser revisadas por pessoas surdas fluentes antes de publicar.
- **Atividade:** o aluno escolhe a resposta e depois toca em "Conferir"; errar gasta uma vida e mostra a resposta certa com uma explicação. O exercício é concluído ao chegar ao fim com vidas; na prova final, pode errar no máximo 1. Refazer algo já concluído é revisão, sem XP.
- **Importante:** o frontend ainda não está conectado à API. Não há autenticação nem verificação real de idade. A loja não usa dinheiro real.

## Estrutura de pastas

```text
frontend/
  app/prototipo/
    index.html         Página do protótipo
    prototipo.css      Estilos (cores ficam em variáveis no topo)
    js/estado.js       Dados do aluno, vidas, recompensas e o que é salvo
    js/conteudo.js     Etapas, exercícios e perguntas (edite aqui o conteúdo)
    js/telas-trilha.js Apresentação, Home e árvore de lições
    js/licao.js        Atividade: escolher, conferir, próxima pergunta, passar ou não
    js/telas-dicionario.js  Dicionário: busca, categorias e alfabeto
    js/telas-ligas.js       Ligas: ranking semanal, sobe e desce de liga
    js/telas-missoes.js     Missões do dia e da semana, com resgate de moedas
    js/telas-lojinha.js     Lojinha: ajudas, acessórios e fundos do mascote
    js/telas-perfil.js      Perfil (conquistas, nome) e Configurações
    js/mascote-desenho.js   Desenho do mascote em SVG (partes do personagem da logo)
    js/telas-mascote.js     Itens do mascote, regras de liberação e o editor
    manifest.webmanifest    Permite instalar o protótipo na tela inicial do celular
    icones/                 Ícones do app (gerados a partir do mascote)
    js/telas-conta.js  Cadastro, login e validação dos dados
    js/app.js          Troca de telas, cliques e teclado (carrega por último)
  assets/images/       Imagens compartilhadas
  assets/vendor/       Bootstrap e Bootstrap Icons (cópias locais, com as licenças)
  landing/             Página pública de apresentação
backend/
  api/edusinal-api/
    src/controllers/   Rotas HTTP da API
    src/schemas/       Formatos de entrada e saída
    src/repositories/  Consultas e gravações MySQL
    src/services/      Regras de negócio, como vidas e recompensas
    estrutura.sql      Banco e tabelas
```

## Abrir o frontend

Na raiz do projeto, rode:

```bash
python3 -m http.server 5500
```

Abra <http://localhost:5500/>. Se a porta 5500 já estiver ocupada, encerre o servidor anterior com `Ctrl+C` ou escolha outra porta, por exemplo `python3 -m http.server 5501`.

A landing de apresentação fica em <http://localhost:5500/frontend/landing/index.html>.

Para abrir uma tela direto, use `?tela=` no endereço: `home`, `login`, `cadastro`, `dicionario`, `ligas`, `missoes`, `lojinha`, `perfil` ou `mais`. Exemplo: <http://localhost:5500/frontend/app/prototipo/index.html?tela=ligas>. Depois de mudar o código, recarregue com `Ctrl+Shift+R` para o navegador não usar a versão antiga em cache.

## Testar no celular

O protótipo tem um layout próprio para celular (até 760 px de largura), no estilo do Duolingo: barra de cima com ofensiva, moedas (tocar abre a lojinha), vidas e a engrenagem das Configurações; barra de baixo com Home, Dicionário, Ligas, Missões, Lojinha e Perfil; atividade e árvore de lições em tela cheia. A Home do celular mostra só o destaque e a trilha (as missões e o resumo de vidas/ofensiva ficam nas abas e na barra de cima).

1. Deixe o computador e o celular na mesma rede Wi-Fi.
2. Na raiz do projeto, rode `python3 -m http.server 5500`.
3. Descubra o IP do computador com `hostname -I` (ex.: `192.168.0.10`).
4. No navegador do celular, abra `http://192.168.0.10:5500/`.

No computador, dá para simular o celular com `F12` → ícone de celular (modo responsivo).

Para instalar como app ("Adicionar à tela inicial"), o celular usa o `manifest.webmanifest` e os ícones de `icones/`. Abrindo pelo IP local, o navegador cria um atalho; o modo app completo, sem a barra do navegador, precisa de HTTPS, por exemplo quando o projeto for publicado no GitHub Pages.

## Como mexer no protótipo

- **Ícones:** use `icon("nome")` no JavaScript ou `<i class="bi bi-nome" aria-hidden="true"></i>` no HTML, com o nome de [icons.getbootstrap.com](https://icons.getbootstrap.com) (ex.: `icon("heart-fill")`). Nas listas de dados (galhos, missões, conquistas), o campo `icon` guarda só o nome.
- **Bootstrap:** o CSS dele carrega antes do `prototipo.css`, que liga as cores do Bootstrap às do EduSinal. Componentes em uso: Toast (`showToast`) e Modal (`askConfirm`).
- **Cores:** variáveis `--primary`, `--accent` e outras no topo de `prototipo.css` (e `landing.css`). Há um bloco separado para o tema escuro.
- **Etapas, galhos e perguntas:** a lista `learningTopics` em `js/conteudo.js`. Cada etapa tem 5 galhos com perguntas de múltipla escolha (`q`, `options`, `answer` = posição da certa, começando em 0, e `explain`). A prova final usa a primeira pergunta de cada galho. Para mostrar uma etapa nova na Home, adicione-a também em `TRAIL_STEPS` (`js/telas-trilha.js`).
- **Regras do jogo:** vidas, XP, moedas, ofensiva e a virada do dia e da semana ficam em `js/estado.js`.
- **Conteúdo das abas:** cada arquivo de aba começa com os seus dados em listas fáceis de editar: `DICTIONARY_WORDS` (palavras), `LEAGUE_RIVALS` (colegas fictícios da liga), `DAILY_MISSIONS` e `WEEKLY_MISSIONS`, `shopItems` e `POWER_UPS` (lojinha) e `ACHIEVEMENTS` (conquistas).
- **Nova tela:** crie a função `render...` em um dos arquivos de telas e registre-a em `screenRenderers` e `screenTitles`.
- Os arquivos de `js/` são scripts comuns carregados em ordem pelo `index.html`; `app.js` precisa ser o último.

## Preparar a API e o MySQL

Pré-requisitos: Python 3.12 ou compatível e um servidor MySQL local em execução.

1. Entre na pasta da API:

```bash
cd backend/api/edusinal-api
```

2. Crie e ative um ambiente virtual:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Instale as dependências e configure o arquivo de ambiente:

```bash
python -m pip install -r requirements.txt
cp src/.env.example src/.env
```

Edite `src/.env` com o host, usuário, senha e porta do seu MySQL. O arquivo `.env` é local e não deve ser enviado ao Git.

4. Crie o banco e as tabelas. Na raiz do projeto:

```bash
mysql -u SEU_USUARIO -p < backend/api/edusinal-api/estrutura.sql
```

Opcionalmente, insira os registros demonstrativos uma única vez:

```bash
mysql -u SEU_USUARIO -p < backend/api/edusinal-api/estrutura_inserts.sql
```

O esquema usa `CREATE DATABASE/TABLE IF NOT EXISTS` e não apaga o banco. O script de inserts tem e-mails e CPFs fictícios; não o execute repetidamente, pois os registros podem violar índices únicos.

5. Inicie a API, ainda dentro da pasta `backend/api/edusinal-api`:

```bash
python -m uvicorn src.app:app --reload
```

Abra <http://127.0.0.1:8000/docs> para explorar a documentação automática da API.

## Rotas atuais da API

| Método | Rota | Para que serve |
| --- | --- | --- |
| `GET`, `POST`, `PUT`, `DELETE` | `/alunos` | CRUD de alunos |
| `GET`, `POST`, `PUT`, `DELETE` | `/professores` | CRUD administrativo de perfis de professor |
| `GET`, `POST`, `PUT`, `DELETE` | `/administradores` | CRUD de administradores |
| `GET` | `/alunos/{id_aluno}/progresso` | Consulta XP, moedas, vidas e ofensiva |
| `POST` | `/alunos/{id_aluno}/atividades/{id_atividade}/respostas` | Registra uma resposta de atividade |

O envio da resposta usa `id_tentativa` (UUID) e `id_resposta`. O servidor consulta o gabarito no MySQL; o cliente não pode declarar que acertou. O mesmo `id_tentativa` torna uma repetição segura contra recompensa duplicada.

## Testes do backend

Com o ambiente virtual ativado e dentro da pasta da API:

```bash
python -m unittest discover -s tests -v
```

Os testes cobrem recuperação de vidas, consumo por erro, recompensa única e bloqueio de tentativa pontuada ao zerar. Eles não substituem um teste integrado com MySQL.

## Organização do código

- **Controller:** recebe a chamada HTTP, valida o recurso e devolve respostas/status HTTP.
- **Schema:** define os campos que entram e saem da API.
- **Repository:** executa SQL e controla transações.
- **Service:** concentra regras que podem ser testadas sem banco ou navegador.

## Limites e próximos passos

O frontend continua usando dados locais e ainda não faz `fetch` para a API. As rotas da API também não têm autenticação/autorização; o ID do aluno na URL não protege dados entre contas. Use apenas em desenvolvimento e não publique a API até implementar sessão, autorização por perfil e proteção dos dados de menores.

A tela de responsável ainda é demonstrativa; os campos do cadastro não verificam identidade, idade ou responsabilidade legal. A leitura de mãos é apenas uma ideia futura: deve ser um módulo isolado, com consentimento e avaliação de privacidade, sem armazenar imagens por padrão. Nenhum modelo de visão computacional foi instalado ou conectado.
