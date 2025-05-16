from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from core.config import SECRET_KEY, ALGORITHM
from models.modelsClass import UserInDB, TokenData
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from models.modelsClass import UserDB, UserCreate
from db.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def create_user(db: Session, user: UserCreate) -> UserDB:
    # Verifica se o usuário já existe
    print("\n -- Chegou aqui no Create User! -- \n")

    existing_user = get_user(user.username, db)
    if existing_user:
        raise ValueError("Username already exists")
    
    # Cria o hash da senha e o novo usuário
    hashed = pwd_context.hash(user.password)
    
    db_user = UserDB(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed
    )
    print("\n -- Chegou aqui no db_user! -- \n")

    # Salva no banco de dados
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    print("\n -- Chegou aqui no retorno do db_user! -- \n")

    return db_user

def get_user(username: str, db: Session) -> UserDB | None:
    return db.query(UserDB).filter(UserDB.username == username).first()

"""
def get_user(username: str):
    if username in fake_db:
        user_data = fake_db[username]
        return UserInDB(**user_data)
"""

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str, db: Session) -> UserDB | None:
    user = get_user(username, db)  # Passe o db
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)  # Injeção do db
):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception

        token_data = TokenData(username=username)
    except JWTError:
        raise credential_exception

    user = get_user(username=token_data.username, db=db)  # Passe o db
    if user is None:
        raise credential_exception

    return user

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    return current_user
