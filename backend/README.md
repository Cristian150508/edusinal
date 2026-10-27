# EduSinal backend

API em Python/FastAPI com MySQL para os perfis e o progresso do EduSinal.

**Antes de programar, leia o [PLANEJAMENTO.md](PLANEJAMENTO.md):** quem faz o quê, o contrato de tabelas e rotas, as regras do jogo com os números e as fases até a entrega. Parte do que está descrito abaixo (perfis de professor, CPF do aluno, rotas com o número do aluno no endereço) vai mudar conforme o planejamento.

Os endpoints de cadastro ficam em `/alunos`, `/professores` e `/administradores`. O módulo inicial de jogo adiciona `GET /alunos/{id_aluno}/progresso` e `POST /alunos/{id_aluno}/atividades/{id_atividade}/respostas`.

O endpoint de jogo usa três vidas, recupera uma vida a cada 30 minutos e retira uma por erro. Uma conclusão correta nova concede 20 XP; a primeira atividade também dá 15 moedas, as seguintes dão 5 moedas. Repetir uma atividade já concluída não rende outra recompensa. O corpo recebe `id_tentativa` e `id_resposta`; o servidor consulta o gabarito no MySQL e não confia em um campo `correta` enviado pelo navegador.

O banco de desenvolvimento é criado por `api/edusinal-api/estrutura.sql`, sem apagar bancos existentes. O script de exemplo insere o gabarito da primeira atividade demonstrativa.

Para iniciar: entre em `api/edusinal-api/`, crie um ambiente virtual, instale `requirements.txt`, copie `src/.env.example` para `src/.env`, configure um MySQL local, aplique os scripts SQL e rode `python -m uvicorn src.app:app --reload`. A documentação interativa fica em `/docs`.

Este módulo ainda não tem autenticação nem está conectado ao frontend. Não o exponha publicamente; os identificadores de aluno precisam ser vinculados a uma sessão autenticada antes de produção. Revisão sem vidas deve permanecer livre na interface. A futura leitura de mãos deve ficar em um módulo isolado, sem armazenar imagens por padrão e com análise específica de privacidade para menores.
