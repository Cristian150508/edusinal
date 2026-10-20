# EduSinal

Plataforma demonstrativa para aprendizagem de Libras. O protótipo é a experiência principal: tem trilha, atividades, vidas, progresso, perfil com mascote personalizável e uma lojinha com moedas fictícias.

## O que existe hoje

- **Frontend:** HTML, CSS e JavaScript. A Home abre em `/`; o estado demonstrativo fica no `localStorage` do navegador.
- **Backend:** Python, FastAPI e MySQL, organizado em controllers, schemas, repositories e services.
- **Vidas:** 3 vidas; cada resposta errada consome uma e uma vida se recupera a cada 30 minutos. Revisar o dicionário continua livre.
- **Recompensas demonstrativas:** uma atividade nova correta concede 20 XP. A primeira dá 15 moedas e libera um broche local no protótipo; cada atividade nova seguinte dá 5 moedas. O inventário ainda não está na API.
- **Importante:** o frontend ainda não está conectado à API. Não há autenticação nem verificação real de idade ou de responsável. A loja não usa dinheiro real.

## Estrutura de pastas

```text
frontend/
  app/prototipo/       Aplicação principal (HTML, CSS e JavaScript)
  assets/images/       Imagens compartilhadas
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
