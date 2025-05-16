from .ocr_service import transcrever_imagem
from .langchain_service import analisar_texto

async def fazer_correcao_redacao(file) -> dict:
    """
    Função principal de correção de redação:
    1. Transcreve imagem para texto
    2. Analisa texto com LLM
    3. Retorna resultado
    """
    # 1. OCR
    texto = await transcrever_imagem(file)

    # 2. Análise com LLM
    tema = "Desafios para a valorização de comunidades e povos tradicionais no Brasil"
    textos_motivadores = """Texto 1: Os povos tradicionais desempenham um papel fundamental na conservação da biodiversidade e na manutenção dos serviços ecossistêmicos.
    Texto 2: A Constituição Federal reconhece os direitos dos povos indígenas às suas terras e culturas."""
    
    resultado = await analisar_texto(texto,tema, textos_motivadores)

    print(resultado)

    return resultado