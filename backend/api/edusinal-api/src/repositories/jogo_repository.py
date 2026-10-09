from datetime import datetime, timezone
from uuid import UUID

from src.database.conexao import conectar
from src.schemas.jogo import EstadoJogo, RespostaAtividade, ResultadoAtividade
from src.services.vidas_service import calcular_resposta, recuperar_vidas


class RespostaInvalida(ValueError):
    pass


class TentativaReutilizada(ValueError):
    pass


def _agora_utc_sem_fuso() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _para_utc(valor: datetime | None) -> datetime | None:
    return valor.replace(tzinfo=timezone.utc) if valor is not None else None


def _garantir_estado(cursor, id_aluno: int) -> None:
    cursor.execute(
        """INSERT INTO progresso_aluno (id_aluno) VALUES (%s)
        ON DUPLICATE KEY UPDATE id_aluno = VALUES(id_aluno)""",
        (id_aluno,),
    )


def consultar_estado(id_aluno: int) -> EstadoJogo:
    agora = _agora_utc_sem_fuso()
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            _garantir_estado(cursor, id_aluno)
            cursor.execute(
                """SELECT xp, moedas, vidas, proxima_vida_em, ofensiva
                FROM progresso_aluno WHERE id_aluno = %s FOR UPDATE""",
                (id_aluno,),
            )
            xp, moedas, vidas, proxima_vida_em, ofensiva = cursor.fetchone()
            vidas_atualizadas, proxima_vida_atualizada = recuperar_vidas(
                vidas, proxima_vida_em, agora
            )
            if (vidas_atualizadas, proxima_vida_atualizada) != (vidas, proxima_vida_em):
                cursor.execute(
                    """UPDATE progresso_aluno
                    SET vidas = %s, proxima_vida_em = %s WHERE id_aluno = %s""",
                    (vidas_atualizadas, proxima_vida_atualizada, id_aluno),
                )
            conexao.commit()

    proxima_vida_em = _para_utc(proxima_vida_atualizada)
    return EstadoJogo(
        id_aluno=id_aluno,
        xp=xp,
        moedas=moedas,
        vidas=vidas_atualizadas,
        proxima_vida_em=proxima_vida_em,
        ofensiva=ofensiva,
        pode_fazer_atividade=vidas_atualizadas > 0,
    )


def registrar_resposta(
    id_aluno: int,
    id_atividade: str,
    resposta: RespostaAtividade,
) -> ResultadoAtividade:
    agora = _agora_utc_sem_fuso()
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            _garantir_estado(cursor, id_aluno)
            cursor.execute(
                """SELECT xp, moedas, vidas, proxima_vida_em
                FROM progresso_aluno WHERE id_aluno = %s FOR UPDATE""",
                (id_aluno,),
            )
            xp, moedas, vidas, proxima_vida_em = cursor.fetchone()

            cursor.execute(
                """SELECT correta FROM respostas_atividade
                WHERE id_atividade = %s AND id_resposta = %s""",
                (id_atividade, resposta.id_resposta),
            )
            registro_resposta = cursor.fetchone()
            if registro_resposta is None:
                conexao.rollback()
                raise RespostaInvalida("A resposta não pertence a esta atividade.")
            correta = bool(registro_resposta[0])

            cursor.execute(
                """SELECT id_atividade, id_resposta, correta, xp_ganho, moedas_ganhas,
                vidas_restantes, criada_em
                FROM tentativas_atividade
                WHERE id_aluno = %s AND id_tentativa = %s""",
                (id_aluno, str(resposta.id_tentativa)),
            )
            tentativa_existente = cursor.fetchone()
            if tentativa_existente is not None:
                atividade_existente, resposta_existente, correta_existente, xp_ganho, moedas_ganhas, vidas_restantes, criada_em = tentativa_existente
                if atividade_existente != id_atividade or resposta_existente != resposta.id_resposta:
                    conexao.rollback()
                    raise TentativaReutilizada("O identificador desta tentativa já foi usado com outros dados.")
                cursor.execute(
                    "SELECT proxima_vida_em FROM progresso_aluno WHERE id_aluno = %s",
                    (id_aluno,),
                )
                proxima_vida_atual = cursor.fetchone()[0]
                conexao.commit()
                return ResultadoAtividade(
                    id_tentativa=resposta.id_tentativa,
                    id_atividade=id_atividade,
                    correta=correta_existente,
                    xp_ganho=xp_ganho,
                    moedas_ganhas=moedas_ganhas,
                    vidas_restantes=vidas_restantes,
                    proxima_vida_em=_para_utc(proxima_vida_atual),
                    atividade_concluida=correta,
                    tentativa_repetida=True,
                )

            cursor.execute(
                """SELECT 1 FROM atividades_concluidas
                WHERE id_aluno = %s AND id_atividade = %s""",
                (id_aluno, id_atividade),
            )
            atividade_ja_concluida = cursor.fetchone() is not None
            cursor.execute(
                "SELECT COUNT(*) FROM atividades_concluidas WHERE id_aluno = %s",
                (id_aluno,),
            )
            primeira_atividade = cursor.fetchone()[0] == 0
            resultado = calcular_resposta(
                xp=xp,
                moedas=moedas,
                vidas=vidas,
                proxima_vida_em=proxima_vida_em,
                correta=correta,
                atividade_ja_concluida=atividade_ja_concluida,
                primeira_atividade=primeira_atividade,
                agora=agora,
            )

            cursor.execute(
                """UPDATE progresso_aluno SET xp = %s, moedas = %s,
                vidas = %s, proxima_vida_em = %s WHERE id_aluno = %s""",
                (
                    resultado.xp,
                    resultado.moedas,
                    resultado.vidas,
                    resultado.proxima_vida_em,
                    id_aluno,
                ),
            )
            if resultado.atividade_concluida:
                cursor.execute(
                    """INSERT INTO atividades_concluidas (id_aluno, id_atividade)
                    VALUES (%s, %s)""",
                    (id_aluno, id_atividade),
                )
            cursor.execute(
                """INSERT INTO tentativas_atividade
                (id_aluno, id_tentativa, id_atividade, id_resposta, correta, xp_ganho,
                moedas_ganhas, vidas_restantes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (
                    id_aluno,
                    str(resposta.id_tentativa),
                    id_atividade,
                    resposta.id_resposta,
                    correta,
                    resultado.xp_ganho,
                    resultado.moedas_ganhas,
                    resultado.vidas,
                ),
            )
        conexao.commit()

    return ResultadoAtividade(
        id_tentativa=resposta.id_tentativa,
        id_atividade=id_atividade,
        correta=correta,
        xp_ganho=resultado.xp_ganho,
        moedas_ganhas=resultado.moedas_ganhas,
        vidas_restantes=resultado.vidas,
        proxima_vida_em=_para_utc(resultado.proxima_vida_em),
        atividade_concluida=resultado.atividade_concluida,
    )