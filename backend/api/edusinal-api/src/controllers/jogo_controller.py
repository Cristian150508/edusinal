from fastapi import APIRouter, HTTPException, status

from src.repositories import alunos_repository, jogo_repository
from src.repositories.jogo_repository import RespostaInvalida, TentativaReutilizada
from src.schemas.jogo import EstadoJogo, RespostaAtividade, ResultadoAtividade
from src.services.vidas_service import SemVidasDisponiveis


router: APIRouter = APIRouter(tags=["Jogo"])


@router.get("/alunos/{id_aluno}/progresso", response_model=EstadoJogo)
def consultar_progresso(id_aluno: int):
    if alunos_repository.consultar_por_id(id_aluno) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aluno não encontrado")
    return jogo_repository.consultar_estado(id_aluno)


@router.post(
    "/alunos/{id_aluno}/atividades/{id_atividade}/respostas",
    response_model=ResultadoAtividade,
)
def responder_atividade(id_aluno: int, id_atividade: str, resposta: RespostaAtividade):
    if alunos_repository.consultar_por_id(id_aluno) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aluno não encontrado")
    try:
        return jogo_repository.registrar_resposta(id_aluno, id_atividade, resposta)
    except SemVidasDisponiveis as erro:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "mensagem": str(erro),
                "proxima_vida_em": erro.proxima_vida_em.isoformat(),
                "revisao_livre": True,
            },
        ) from erro
    except RespostaInvalida as erro:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(erro),
        ) from erro
    except TentativaReutilizada as erro:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(erro),
        ) from erro