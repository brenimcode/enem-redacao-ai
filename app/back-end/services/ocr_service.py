import cv2
import numpy as np
import pytesseract
from PIL import Image
from fastapi import UploadFile

# Configura o caminho do Tesseract no Windows
pytesseract.pytesseract.tesseract_cmd = r'c:\Program Files\Tesseract-OCR\tesseract.exe'

async def transcrever_imagem(file: UploadFile, pre_processor: str = "thresh") -> str:
    """
    Recebe um UploadFile, aplica pré-processamento via OpenCV e realiza OCR retornando o texto extraído.

    Parâmetros:
    - file: UploadFile contendo a imagem
    - pre_processor: método de pré-processamento ('thresh' ou 'blur')
    """

    # Função para deskew (alinhar horizontalmente)
    def deskew(image):
        coords = np.column_stack(np.where(image > 0))
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        (h, w) = image.shape[:2]
        M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
        rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return rotated

    # Lê os bytes da imagem enviada
    image_bytes = await file.read()
    image_np = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # Pré-processamento padrão: escala de cinza
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Aplicar pré-processamento selecionado
    if pre_processor == "blur":
        processed = cv2.medianBlur(gray, 3)
    elif pre_processor == "thresh":
        processed = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV, 25, 15
        )
    else:
        processed = gray  # sem nenhum pré-processamento

    # Deskew opcional (sempre aplicando)
    processed = deskew(processed)

    # Converter para PIL para pytesseract
    proc_pil = Image.fromarray(processed)

    # Realizar OCR
    text = pytesseract.image_to_string(proc_pil, lang='por', config='--psm 6')

    return text
