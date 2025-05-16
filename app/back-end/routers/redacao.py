from models.modelsClass import User
from core.security import get_current_active_user
from fastapi import APIRouter, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from services.correcao_service import fazer_correcao_redacao
from models.modelsClass import RedacaoResponse

router = APIRouter()

@router.post("/redacao", response_model=RedacaoResponse)
async def correcao_redacao(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        return JSONResponse(
            status_code=400,
            content={"error": "Formato de arquivo não suportado. Use JPG, PNG ou JPEG."}
        )

    resultado = await fazer_correcao_redacao(file)
    print(resultado)
   
    return resultado
