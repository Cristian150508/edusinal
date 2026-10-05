# EduSinal

Plataforma de aprendizagem de Libras. O protótipo é a experiência principal e a página pública de apresentação permanece disponível em `frontend/landing/`.

## Avaliação do projeto

### Estado atual

- **Interface:** o endereço raiz abre o protótipo, com apresentação inicial, trilha, atividades, perfil personalizável, lojinha demonstrativa e área do responsável. O serviço de aulas particulares foi adiado.
- **Persistência:** a área de aprendizagem usa dados fictícios e `localStorage`; não há autenticação nem gravação no MySQL.
- **API:** `backend/api/super-dev-09-curso-trabalho-trio/` contém uma API FastAPI com conexão MySQL e CRUDs para alunos, professores e administradores. Ainda não está integrada ao site.
- **Etapa atual:** interface demonstrativa e API EduSinal separadas; integração e autenticação ainda pendentes.

### Passos e critérios de conclusão

- [x] **1. Definir o protótipo como experiência principal.** O endereço raiz abre o protótipo; visitantes sem perfil veem a apresentação inicial e perfis já salvos entram em sua área.
- [ ] **2. Preparar o contrato da API EduSinal.** Definir entidades, campos, validações e rotas para perfis e papéis, conteúdo de Libras, atividades, progresso e, se mantido, contato com professores. Critério: cada tela que buscar ou salvar dados tem uma rota e um formato JSON acordados.
- [ ] **3. Validar o backend FastAPI.** A API agora registra `/alunos`, `/professores` e `/administradores`. Critério: `/docs` abre e os CRUDs passam por testes de sucesso, validação e registro inexistente.
- [ ] **4. Preparar o MySQL para desenvolvimento.** O esquema inicial tem tabelas para os três perfis e dados fictícios em `estrutura_inserts.sql`. Configure as variáveis de ambiente e teste a conexão local antes de marcar esta etapa.
- [ ] **5. Conectar a interface à API.** Centralizar a URL base, buscar e enviar dados com `fetch`, apresentar estados de carregamento/erro e remover os dados fictícios gradualmente. Critério: criar, consultar, editar e excluir um registro de teste pela interface reflete no MySQL.
- [ ] **6. Fechar a avaliação de segurança e acessibilidade.** Verificar autenticação e autorização por papel, proteção dos dados de menores, CORS restrito, navegação por teclado e conteúdo de Libras revisado por pessoas qualificadas. Critério: nenhum dado privado fica exposto e os fluxos principais são utilizáveis sem mouse.

## API EduSinal

Em `backend/api/super-dev-09-curso-trabalho-trio/src/app.py`, a aplicação registra os CRUDs de alunos, professores e administradores. Cada grupo possui operações `GET`, `POST`, `PUT` e `DELETE`, com acesso ao MySQL feito pelos repositories.

- O CRUD de administradores ainda não tem autenticação; não exponha a API publicamente antes de implementar autorização por perfil.
- O arquivo `src/settings/settings.py` carrega as configurações de `src/.env`; use `src/.env.example` como referência e não publique credenciais.
- O frontend ainda usa dados demonstrativos. CORS e integração com `fetch` serão necessários ao conectá-lo à API.
- `estrutura.sql` cria o banco `edusinal` e suas três tabelas sem apagar bancos existentes. `estrutura_inserts.sql` inclui dados fictícios de demonstração.
- A lojinha usa moedas fictícias do protótipo, sem pagamentos reais. A confirmação de responsável e qualquer verificação etária ainda não são autenticação nem validação legal.

## Como conferir localmente

1. Sirva os arquivos estáticos a partir da raiz do projeto: `python -m http.server 5500`.
2. Abra `http://localhost:5500/` para entrar no protótipo principal. A landing pública fica em `http://localhost:5500/frontend/landing/index.html`.
3. Em outro terminal, entre em `backend/api/super-dev-09-curso-trabalho-trio/`, instale `requirements.txt` no ambiente virtual e inicie a API com `python -m uvicorn src.app:app --reload`.
4. Abra `http://127.0.0.1:8000/docs` para conferir os CRUDs de alunos, professores e administradores. A documentação não significa que o frontend já esteja integrado.
5. Marque uma etapa acima como concluída somente depois de atender ao critério descrito nela; registre aqui decisões ou bloqueios encontrados.
