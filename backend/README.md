# EduSinal backend

API em Python/FastAPI com MySQL para três perfis do EduSinal: alunos, professores e administradores.

Os endpoints de cadastro ficam em `/alunos`, `/professores` e `/administradores`. Cada grupo oferece operações de consulta, criação, edição e exclusão. A documentação interativa fica em `/docs` quando a API estiver rodando.

O banco de desenvolvimento é criado pelo `api/super-dev-09-curso-trabalho-trio/estrutura.sql`. O script não apaga bancos existentes. `estrutura_inserts.sql` contém registros demonstrativos para os três perfis.

O CRUD de administradores ainda não tem autenticação e deve ser usado somente em desenvolvimento até existir controle de acesso por perfil.
