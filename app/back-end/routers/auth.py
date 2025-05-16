from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from core.security import create_access_token, authenticate_user, create_user
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from models.modelsClass import Token, UserCreate
from db.database import get_db
from sqlalchemy.orm import Session


router = APIRouter()

@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)  # Injeção do db
):
    user = authenticate_user(form_data.username, form_data.password, db)  # Passe o db
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

""""
@router.post("/register", status_code=201)
async def create_user(user: UserCreate):

    # Verifica se o usuário já existe
    if user.username in fake_db:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Cria o hash da senha
    hashed_password = get_password_hash(user.password)

    # Insere o usuário no banco de dados
    fake_db[user.username] = {
        "username": user.username,
        "full_name": user.full_name,
        "email": user.email,
        "hashed_password": hashed_password,
        "disabled": False,
    }

    return {"message": "User created successfully", "username": user.username}
"""

@router.post("/register", status_code=201)
async def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Tenta criar o usuário usando a função do database.py
        db_user = create_user(db, user)
        
        # Retorna resposta de sucesso
        print("\n -- Chegou aqui no Create User ROUTER e vai ser sucesso! -- \n")
        return {
            "message": "User created successfully",
            "username": db_user.username,
            "email": db_user.email
        }
        
    except ValueError as e:
        # Trata erro de usuário já existente
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Trata outros erros
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar usuário"
        )