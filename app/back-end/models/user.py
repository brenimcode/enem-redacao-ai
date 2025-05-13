from pydantic import BaseModel
from typing import Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str


class UserCreate(BaseModel):
    username: str
    full_name: str
    email: str
    password: str
    disabled: bool = False

class CompetencyResult(BaseModel):
    label: str
    score: int
    maxScore: int

class RedacaoResponse(BaseModel):
    description: str
    score: int
    competencies: List[CompetencyResult]