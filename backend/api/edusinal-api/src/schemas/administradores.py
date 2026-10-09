from dataclasses import dataclass
from datetime import date


@dataclass
class Administrador:
    id_administrador: int
    nome: str
    email: str
    telefone: str | None
    data_cadastro: date


@dataclass
class AdministradorCadastro:
    nome: str
    email: str
    telefone: str | None = None


@dataclass
class AdministradorEditar:
    nome: str
    email: str
    telefone: str | None = None