
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.chat import router as chat_router

import os
from pathlib import Path
from dotenv import load_dotenv
from starlette.middleware.sessions import SessionMiddleware
app = FastAPI()


# Read environment variables from backend/.env
load_dotenv(Path(__file__).resolve().parent / ".env")

secret_key = os.getenv("SESSION_SECRET_KEY")

if not secret_key:
    raise RuntimeError("SESSION_SECRET_KEY is missing.")

# Enable signed login sessions
app.add_middleware(
    SessionMiddleware,
    secret_key=secret_key, # Signs cookies so users cannot alter the session without detection
    session_cookie="forensics_session", # Names the cookie
    max_age=3600, # session expire after one hour
    same_site="lax", # disables cross site request forgery (CSRF) attacks
    https_only=False 
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"]
)

app.include_router(auth_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok"}
