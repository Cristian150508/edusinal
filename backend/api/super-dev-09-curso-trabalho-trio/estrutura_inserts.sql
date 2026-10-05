USE edusinal;

INSERT INTO alunos (nome, cpf, data_nascimento, email, telefone) VALUES
('Aluno Demonstração', '00000000001', '2005-01-15', 'aluno@example.test', '11900000001');

INSERT INTO professores (nome, cpf, email, telefone, formacao, data_contratacao) VALUES
('Professor Demonstração', '00000000002', 'professor@example.test', '11900000002', 'Libras', CURRENT_DATE);

INSERT INTO administradores (nome, email, telefone) VALUES
('Administrador Demonstração', 'admin@example.test', '11900000003');