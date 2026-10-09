from fastapi import APIRouter, HTTPException, status

from src.repositories import administradores_repository
from src.schemas.administradores import AdministradorCadastro, AdministradorEditar


router: APIRouter = APIRouter(prefix="/administradores", tags=["Administradores"])


@router.get("")
def listar_administradores():
    return administradores_repository.consultar_todos()


@router.post("", status_code=status.HTTP_201_CREATED)
def cadastrar(administrador: AdministradorCadastro):
    return administradores_repository.cadastrar(administrador)


@router.get("/{id_administrador}")
def consultar_por_id(id_administrador: int):
    administrador = administradores_repository.consultar_por_id(id_administrador)
    if administrador is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador não encontrado")
    return administrador


@router.put("/{id_administrador}")
def editar(id_administrador: int, administrador: AdministradorEditar):
    if administradores_repository.consultar_por_id(id_administrador) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador não encontrado")
    administradores_repository.editar(id_administrador, administrador)
    return {"status": "ok"}


@router.delete("/{id_administrador}")
def apagar(id_administrador: int):
    if administradores_repository.consultar_por_id(id_administrador) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador não encontrado")
    administradores_repository.apagar(id_administrador)
    return {"status": "ok"}