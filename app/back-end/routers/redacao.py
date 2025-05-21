from models.modelsClass import User
from core.security import get_current_active_user
from fastapi import APIRouter, File, UploadFile, Depends, Form
from fastapi.responses import JSONResponse
from services.correcao_service import fazer_correcao_redacao
from models.modelsClass import RedacaoResponse
from PIL import Image
from io import BytesIO
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Add rate-limiting decorator
@router.post("/redacao", response_model=RedacaoResponse)
@limiter.limit("1/minute;100/hour;500/day")
async def correcao_redacao(
    request: Request,
    file: UploadFile = File(...),
    tema: str = Form(...),
    textos_motivadores: str = Form(...),
    current_user: User = Depends(get_current_active_user)
):
    # Verificar tipo de arquivo
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        return JSONResponse(
            status_code=415,  # Unsupported Media Type
            content={"error": "Formato de arquivo não suportado. Use JPG, PNG ou JPEG."}
        )

    # Limitar tamanho do arquivo (5MB = 5 * 1024 * 1024 bytes)
    file_size = await file.read()
    if len(file_size) > 5 * 1024 * 1024:
        return JSONResponse(
            status_code=413,  # Payload Too Large
            content={"error": "O arquivo excede o tamanho máximo permitido de 5MB."}
        )

    # Verificar se o arquivo é uma imagem válida
    try:
        image = Image.open(BytesIO(file_size))
        image.verify()  # Verifica se é uma imagem válida
    except Exception:
        return JSONResponse(
            status_code=422,  # Unprocessable Entity
            content={"error": "O arquivo enviado não é uma imagem válida."}
        )

    # Resetar o ponteiro do arquivo para reutilizá-lo
    file.file.seek(0)

    # Processar a correção da redação
    resultado = await fazer_correcao_redacao(file, tema, textos_motivadores)
   
    return resultado
