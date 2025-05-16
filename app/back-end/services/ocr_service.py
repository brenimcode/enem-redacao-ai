import cv2
import numpy as np
import pytesseract
from PIL import Image
from fastapi import UploadFile
from decouple import config
import os

# Carrega o valor base do TESSDATA_PREFIX do .env
tessdata_prefix = config("TESSDATA_PREFIX")

# Define no ambiente
os.environ["TESSDATA_PREFIX"] = tessdata_prefix

# Caminho para usar no config do Tesseract
tessdata_dir_config = f'--tessdata-dir "{tessdata_prefix}"'

# Configura o caminho do Tesseract no Windows
pytesseract.pytesseract.tesseract_cmd = r'c:\Program Files\Tesseract-OCR\tesseract.exe'

# Verificação dos arquivos necessários (diagnóstico)
def verificar_tesseract():
    tessdata_dir = tessdata_prefix
    portuguese_data = os.path.join(tessdata_dir, 'por.traineddata')
    
    if not os.path.isfile(pytesseract.pytesseract.tesseract_cmd):
        print(f"ERRO: Tesseract não encontrado em: {pytesseract.pytesseract.tesseract_cmd}")
        return False
        
    if not os.path.isdir(tessdata_dir):
        print(f"ERRO: Diretório tessdata não encontrado: {tessdata_dir}")
        return False
        
    if not os.path.isfile(portuguese_data):
        print(f"ERRO: Arquivo por.traineddata não encontrado em: {portuguese_data}")
        return False
        
    print(f"Configuração do Tesseract OK. Usando arquivo: {portuguese_data}")
    return True

# Executar verificação na inicialização
verificar_tesseract()


async def transcrever_imagem(file: UploadFile, pre_processor: str = "thresh") -> str:
    """
    Recebe um UploadFile, aplica pré-processamento via OpenCV e realiza OCR retornando o texto extraído.

    Parâmetros:
    - file: UploadFile contendo a imagem
    - pre_processor: método de pré-processamento ('thresh' ou 'blur')
    """
    
    # Lê os bytes da imagem enviada
    image_bytes = await file.read()
    image_np = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # Pré-processamento padrão: escala de cinza
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Converter para PIL para pytesseract
    proc_pil = Image.fromarray(gray)

    # Realizar OCR
    text = pytesseract.image_to_string(proc_pil, lang='por', config='--psm 6')

    return text
