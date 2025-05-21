from .ocr_service import transcrever_imagem
from .langchain_service import analisar_texto
from models.modelsClass import LLMResponse, RedacaoResponse

async def fazer_correcao_redacao(file, tema: str, textos_motivadores: str) -> dict:
    """
    Função principal de correção de redação:
    1. Transcreve imagem para texto
    2. Analisa texto com LLM
    3. Retorna resultado
    """
    # 1. OCR
    texto = await transcrever_imagem(file)

    # 2. Análise com LLM
    llm_result = await analisar_texto(texto, tema, textos_motivadores)

    redacao_response = RedacaoResponse.from_llm_response(llm_result)

    return redacao_response