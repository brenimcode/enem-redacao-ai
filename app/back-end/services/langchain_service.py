from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os
from decouple import config

os.environ['GOOGLE_API_KEY'] = config('GOOGLE_API_KEY')

async def analisar_texto(texto: str) -> str:
    """
    Recebe o texto transcrito e envia para o modelo Gemini 2.0 Flash,
    retornando a correção/análise.
    """
    # Inicializa o modelo Gemini 2.0 Flash
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0.0,
        max_tokens=2048,
        timeout=30,
        max_retries=2
    )   
    
    # Define o prompt em estilo chat
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Você é um corretor de redações do ENEM(brasil) que avalia e sugere melhorias. Sua tarefa é sempre deixar a sua **resposta** no seguinte formato JSON também: {{\"description\": \"A redação apresenta uma boa argumentação, mas carece de maior aprofundamento em alguns pontos.\", \"score\": 850, \"competencies\": [{{\"label\": \"Competência 1\", \"score\": 180, \"maxScore\": 200}}, {{\"label\": \"Competência 2\", \"score\": 170, \"maxScore\": 200}}, {{\"label\": \"Competência 3\", \"score\": 160, \"maxScore\": 200}}, {{\"label\": \"Competência 4\", \"score\": 170, \"maxScore\": 200}}, {{\"label\": \"Competência 5\", \"score\": 170, \"maxScore\": 200}}]}}"),
        ("human", "Corrija e avalie a seguinte redação:{texto}")
    ])
    
    # Monta a cadeia com parser de saída para string
    chain = prompt | llm | StrOutputParser()

    # Executa a chain de forma assíncrona
    resposta = await chain.ainvoke({"texto": texto})
    return resposta