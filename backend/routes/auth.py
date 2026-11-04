import sqlite3
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash

router = APIRouter()

# Locate the existing SQLite database
DB_PATH = Path(__file__).resolve().parent.parent / "forensics.db"

# Password hashing utility
password_hasher = PasswordHash.recommended()


# Expected login data (existing)
class LoginRequest(BaseModel):
    username: str
    password: str


# Expected registration data (new)
class RegisterRequest(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=50,
        pattern=r"^[A-Za-z0-9_]+$"
    )
    email: EmailStr
    password: str = Field(
        min_length=12,
        max_length=128
    )


# Existing login endpoint
@router.post("/login")
def login(credentials: LoginRequest):
    raise HTTPException(
        status_code=501,
        detail="Authentication not implemented yet."
    )


# New registration endpoint
@router.post("/register", status_code=201)
def register(data: RegisterRequest):

    # argon2 hash
    hashed_password = password_hasher.hash(data.password)

    # establish connection to sqlite database
    conn = sqlite3.connect(DB_PATH)

    try:
        # insert acc
        cursor = conn.execute(
            """
            INSERT INTO users
                (username, email, password_hash)
            VALUES (?, ?, ?)
            """,
            (
                data.username,
                str(data.email).lower(),
                hashed_password
            )
        )

       
        conn.commit()

        
        return {
            "message": "Account created successfully!",
            "user_id": cursor.lastrowid
        }

    except sqlite3.IntegrityError:
        conn.rollback()

        raise HTTPException(
            status_code=409,
            detail="Username or email already exists."
        )

    finally:
        # Always close the database connection
        conn.close()    