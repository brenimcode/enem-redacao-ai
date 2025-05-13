from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from core.security import create_access_token, authenticate_user, get_password_hash
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from models.user import Token, UserCreate
from db.fake_db import fake_db

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}



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