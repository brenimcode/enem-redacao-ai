from .ocr_service import transcrever_imagem
from .langchain_service import analisar_texto

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
    resultado = await analisar_texto(texto, tema, textos_motivadores)

    print("\n\n\n============== ",texto, " ==============")
    print("\n============== ",tema, " ==============")
    print("\n============== ",textos_motivadores, " ==============\n\n")

    return resultado