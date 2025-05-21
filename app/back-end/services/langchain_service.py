from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
from decouple import config
from models.modelsClass import LLMResponse
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate

os.environ['GOOGLE_API_KEY'] = config('GOOGLE_API_KEY')

# Montagem do prompt (system + human), com placeholders tema, textos_motivadores e texto
prompt_template = """
# Você é um corretor de redações do ENEM. Sua tarefa é **primeiro** analisar o texto OCR inserido e corrigir erros de reconhecimento(OCR) para reconstruir a mensagem original com a maior fidelidade possível ao conteúdo e estilo do texto, sem adicionar, remover ou alterar o significado das palavras e frases originais. Sua **segunda** tarefa: avaliar o texto do candidato usando **exatamente** os critérios oficiais das 5 competências do ENEM e devolver **apenas** um JSON com esta estrutura:

# **Template de saída**:
{{
  "description": "<comentário geral sucinto sobre pontos fortes e fracos da redação em cada competencia de forma geral.>",
  "competencies":[<nota competência 1>, <nota competência 2>, <nota competência 3>, <nota competência 4>, <nota competência 5>]
}}

- Retorne **somente** o JSON acima, nada mais.

# **Regras importantes:**
1. **JSON puro**: não inclua texto explicativo fora do JSON (CRUCIALMENTE IMPORTANTE!).
2. Para avaliar as competencias, sempre atribua nota a cada uma das competencias seguindo o critério oficial conforme a descrição abaixo.

# **Critérios de Avaliação da Redação ENEM — Competências e Pontuação**

## Notas possíveis por competência: **0, 40, 80, 120, 160, 200 pontos**

### Competência 1:

**Domínio da modalidade escrita formal da Língua Portuguesa.**

* **200**: Excelente domínio da norma culta, com raros desvios.
* **160**: Bom domínio, com poucos desvios.
* **120**: Domínio mediano, com alguns desvios.
* **80**: Domínio insuficiente, com muitos desvios.
* **40**: Domínio precário, com desvios sistemáticos.
* **0**: Desconhecimento da norma culta.

### Competência 2:

**Compreender a proposta e desenvolver o tema de forma argumentativa em prosa.**

* **200**: Tema desenvolvido com argumentação consistente, estrutura adequada e repertório produtivo.
* **160**: Argumentação consistente e organizada, com repertório pertinente.
* **120**: Argumentação previsível, com repertório limitado.
* **80**: Desenvolvimento tangencial ou frágil, com repertório pouco pertinente.
* **40**: Desenvolvimento inadequado, incoerente ou superficial.
* **0**: Fuga total ao tema ou texto fora do gênero dissertativo-argumentativo.

### Competência 3:

**Selecionar, organizar e interpretar informações, fatos e argumentos em defesa de um ponto de vista.**

* **200**: Informações e argumentos bem organizados e articulados, com excelente progressão.
* **160**: Informações organizadas e adequadas, com boa progressão.
* **120**: Organização mediana, com argumentação previsível.
* **80**: Argumentação frágil e progressão comprometida.
* **40**: Informações inconsistentes ou inadequadas.
* **0**: Ausência de ponto de vista ou texto incoerente.

### Competência 4:

**Domínio dos recursos coesivos para articular as partes do texto.**

* **200**: Excelente uso de recursos coesivos, garantindo clareza e fluidez.
* **160**: Bom uso, com poucas inadequações.
* **120**: Uso mediano, com algumas falhas.
* **80**: Uso insuficiente e inadequado, prejudicando a progressão.
* **40**: Uso precário, dificultando a compreensão.
* **0**: Texto incoerente, sem articulação.


### Competência 5:

**Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.**

* **200**: Proposta completa e detalhada (agente, ação, modo/meio, efeito), respeitando os direitos humanos.
* **160**: Proposta bem estruturada e pertinente, podendo faltar algum detalhamento.
* **120**: Proposta relacionada ao tema, com estrutura limitada.
* **80**: Proposta vaga ou incompleta, com poucos elementos.
* **40**: Proposta inadequada ou desrespeitosa aos direitos humanos.
* **0**: Ausência de proposta ou desrespeito grave aos direitos humanos.


# Dados de Entrada:

## Tema da redação:
{tema}

## Textos motivadores:
{textos_motivadores}

## Texto da redação:
{texto}

"""

# Cria um parser baseado no seu schema Pydantic
parser = PydanticOutputParser(pydantic_object=LLMResponse)

# -------------------------------------------------------------------
async def analisar_texto(texto: str, tema: str, textos_motivadores: str) -> LLMResponse:
    """
    Recebe o texto da redação, envia ao Gemini 2.0 Flash e
    retorna um dict conforme LLMResponse.
    """

    # 1️⃣ Configura o LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0.0,
        max_tokens=16048,
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

