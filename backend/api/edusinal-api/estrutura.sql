CREATE DATABASE IF NOT EXISTS edusinal
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE edusinal;

CREATE TABLE IF NOT EXISTS alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE)
);

CREATE TABLE IF NOT EXISTS professores (
    id_professor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    formacao VARCHAR(100),
    data_contratacao DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS administradores (
    id_administrador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE)
);

CREATE TABLE IF NOT EXISTS progresso_aluno (
    id_aluno INT PRIMARY KEY,
    xp INT NOT NULL DEFAULT 0,
    moedas INT NOT NULL DEFAULT 40,
    vidas TINYINT UNSIGNED NOT NULL DEFAULT 3,
    proxima_vida_em DATETIME NULL,
    ofensiva INT UNSIGNED NOT NULL DEFAULT 0,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_progresso_aluno FOREIGN KEY (id_aluno)
        REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    CONSTRAINT chk_progresso_vidas CHECK (vidas <= 3)
);

CREATE TABLE IF NOT EXISTS respostas_atividade (
    id_atividade VARCHAR(80) NOT NULL,
    id_resposta VARCHAR(80) NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_atividade, id_resposta)
);

CREATE TABLE IF NOT EXISTS atividades_concluidas (
    id_aluno INT NOT NULL,
    id_atividade VARCHAR(80) NOT NULL,
    concluida_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_aluno, id_atividade),
    CONSTRAINT fk_atividade_concluida_aluno FOREIGN KEY (id_aluno)
        REFERENCES alunos(id_aluno) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tentativas_atividade (
    id_aluno INT NOT NULL,
    id_tentativa CHAR(36) NOT NULL,
    id_atividade VARCHAR(80) NOT NULL,
    id_resposta VARCHAR(80) NOT NULL,
    correta BOOLEAN NOT NULL,
    xp_ganho INT NOT NULL DEFAULT 0,
    moedas_ganhas INT NOT NULL DEFAULT 0,
    vidas_restantes TINYINT UNSIGNED NOT NULL,
    criada_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_aluno, id_tentativa),
    INDEX idx_tentativas_aluno_data (id_aluno, criada_em),
    CONSTRAINT fk_tentativa_aluno FOREIGN KEY (id_aluno)
        REFERENCES alunos(id_aluno) ON DELETE CASCADE
);