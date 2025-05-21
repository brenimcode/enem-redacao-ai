from fastapi import FastAPI
from routers import auth, redacao
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

app = FastAPI()

# Initialize the rate limiter
limiter = Limiter(key_func=get_remote_address)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Permite o front-end acessar o back-end
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add SlowAPI middleware
app.add_middleware(SlowAPIMiddleware)

# Attach the limiter to the app
app.state.limiter = limiter

# Inclui as rotas
app.include_router(auth.router, tags=["auth"])
app.include_router(redacao.router, tags=["redacao"])

@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"error": "Muitas requisições. Tente novamente mais tarde."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)