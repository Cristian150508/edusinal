from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class RespostaAtividade(BaseModel):
    id_tentativa: UUID
    id_resposta: str = Field(min_length=1, max_length=80)


class EstadoJogo(BaseModel):
    id_aluno: int
    xp: int
    moedas: int
    vidas: int = Field(ge=0, le=3)
    proxima_vida_em: datetime | None
    ofensiva: int
    pode_fazer_atividade: bool


class ResultadoAtividade(BaseModel):
    id_tentativa: UUID
    id_atividade: str
    correta: bool
    xp_ganho: int
    moedas_ganhas: int
    vidas_restantes: int = Field(ge=0, le=3)
    proxima_vida_em: datetime | None
    atividade_concluida: bool
    tentativa_repetida: bool = False