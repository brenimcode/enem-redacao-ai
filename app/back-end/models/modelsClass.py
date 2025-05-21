from pydantic import BaseModel
from typing import Optional, List
from db.database import Base
from sqlalchemy import Column, Integer, String, Boolean
from pydantic import BaseModel, Field, model_validator
from typing import List

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None

class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    username: str
    full_name: str
    email: str
    password: str

class CompetencyResult(BaseModel):
    label: str
    score: int
    maxScore: int

class RedacaoResponse(BaseModel):
    description: str
    score: int
    competencies: List[CompetencyResult]

# Banco de dadso:

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class LLMResponse(BaseModel):
    description: str
    competencies: List[int]

class RedacaoResponse(BaseModel):
    description: str
    competencies: List[int]
    score: int
    
    @classmethod
    def from_llm_response(cls, llm_response: LLMResponse):
        return cls(
            description=llm_response.description,
            competencies=llm_response.competencies,
            score=sum(llm_response.competencies)
        )