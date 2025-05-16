from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
from decouple import config
from models.modelsClass import RedacaoResponse
from langchain.output_parsers import PydanticOutputParser
from langchain import LLMChain
from typing import Any, Dict
from langchain_core.prompts import PromptTemplate

os.environ['GOOGLE_API_KEY'] = config('GOOGLE_API_KEY')

# Montagem do prompt (system + human), com placeholders tema, textos_motivadores e texto
prompt_template = """
# Você é um corretor de redações do ENEM (Brasil). Sua tarefa é **primeiro** analisar o texto OCR inserido e corrigir erros de reconhecimento(OCR) para reconstruir a mensagem original com a maior fidelidade possível ao conteúdo e estilo do texto, sem adicionar, remover ou alterar o significado das palavras e frases originais. Sua **segunda** tarefa: avaliar o texto do candidato usando **exatamente** os critérios oficiais das 5 competências do ENEM e devolver **apenas** um JSON com esta estrutura:

# **Template de saída**:
{{
  "description": "<comentário geral sucinto sobre pontos fortes e fracos da redação>",
  "score": <nota total, de 0 a 1000>,
  "competencies":[<nota competência 1>, <nota competência 2>, <nota competência 3>, <nota competência 4>, <nota competência 5>]
}}

# **Regras importantes:**
1. **JSON puro**: não inclua texto explicativo fora do JSON.
2. Use exatamente as 5 competências do ENEM, com pesos de 200 cada.
3. Siga os critérios oficiais de cada competência.
4. Some as notas para formar o score total (0–1000).

Você receberá:
- `tema`: o tema oficial.
- `textos_motivadores`: textos de apoio.
- `texto`: a redação do candidato.

Retorne **somente** o JSON acima, nada mais.

Tema da redação: {tema}

Textos motivadores:
{textos_motivadores}

Texto da redação:
{texto}

"""

# Cria um parser baseado no seu schema Pydantic
parser = PydanticOutputParser(pydantic_object=RedacaoResponse)

# -------------------------------------------------------------------
async def analisar_texto(texto,tema,textos_motivadores):
    """
    Recebe o texto da redação, envia ao Gemini 2.0 Flash e
    retorna um dict conforme RedacaoResponse.
    """

    # 1️⃣ Configura o LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0.0,
        max_tokens=10048,
        timeout=30,
        max_retries=2
    )

    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["tema", "textos_motivadores","texto"],
    )

    # 2️⃣ Monta a chain com prompt e parser
    chain = prompt | llm | parser

    return chain.invoke({"tema": tema,"textos_motivadores":textos_motivadores,"texto": texto})