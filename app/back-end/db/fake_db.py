from passlib.context import CryptContext

fake_db = {
    "tim": {
        "username": "tim",
        "full_name": "Tim Busca",
        "email": "tim@gmail.com",
        "hashed_password": CryptContext(schemes=["bcrypt"], deprecated="auto").hash("123"),
        "disabled": False
    }
}