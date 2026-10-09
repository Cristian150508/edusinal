from fastapi import FastAPI
from src.controllers import administradores_controller, alunos_controller, jogo_controller, professores_controller


app = FastAPI(
    title="EduSinal API",
    description="API para gerenciar alunos, professores e administradores do EduSinal.",
    version="1.0.0",
)

app.include_router(alunos_controller.router)
app.include_router(professores_controller.router)
app.include_router(administradores_controller.router)
app.include_router(jogo_controller.router)


if __name__ == "__main__":

    import uvicorn
