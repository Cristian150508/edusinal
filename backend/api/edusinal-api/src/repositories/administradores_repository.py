from typing import Optional

from src.database.conexao import conectar
from src.schemas.administradores import Administrador, AdministradorCadastro, AdministradorEditar


def consultar_todos() -> list[Administrador]:
    sql = """SELECT id_administrador, nome, email, telefone, data_cadastro
    FROM administradores
    ORDER BY id_administrador"""

    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql)
            registros = cursor.fetchall()

    return [Administrador(*registro) for registro in registros]


def cadastrar(administrador: AdministradorCadastro) -> Administrador:
    sql = """INSERT INTO administradores (nome, email, telefone)
    VALUES (%s, %s, %s)"""

    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (administrador.nome, administrador.email, administrador.telefone))
            novo_id = cursor.lastrowid
            conexao.commit()

    return consultar_por_id(novo_id)


def consultar_por_id(id_administrador: int) -> Optional[Administrador]:
    sql = """SELECT id_administrador, nome, email, telefone, data_cadastro
    FROM administradores
    WHERE id_administrador = %s"""

    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (id_administrador,))
            registro = cursor.fetchone()

    return Administrador(*registro) if registro else None


def editar(id_administrador: int, administrador: AdministradorEditar) -> None:
    sql = """UPDATE administradores
    SET nome = %s, email = %s, telefone = %s
    WHERE id_administrador = %s"""

    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(sql, (administrador.nome, administrador.email, administrador.telefone, id_administrador))
        conexao.commit()


def apagar(id_administrador: int) -> None:
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("DELETE FROM administradores WHERE id_administrador = %s", (id_administrador,))
        conexao.commit()