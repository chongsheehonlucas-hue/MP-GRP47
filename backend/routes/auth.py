import sqlite3
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash

router = APIRouter()

# Locate the existing SQLite database
DB_PATH = Path(__file__).resolve().parent.parent / "forensics.db"

# Password hashing utility
password_hasher = PasswordHash.recommended()
# Used to mitigate timing attacks during login attempts with non-existent usernames 
DUMMY_HASH = password_hasher.hash("unused-dummy-password")  #by hashing a dummy password, we can use this hash to compare against any login attempts with non-existent usernames. This helps to ensure that the time taken to respond to login attempts is consistent, regardless of whether the username exists or not, thereby mitigating timing attacks.


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



@router.post("/login")
def login(credentials: LoginRequest, request: Request):

    # Connect to db
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        # Search for the username
        user = conn.execute(
            """
            SELECT user_id, username, password_hash, role
            FROM users
            WHERE username = ?
            """,
            (credentials.username,)
        ).fetchone()

    finally:
        conn.close()

    # Verify the submitted password
    hash_to_check = (
        user["password_hash"]
        if user is not None
        else DUMMY_HASH
    )

    valid_password = password_hasher.verify(
        credentials.password,
        hash_to_check
    )

    # Reject invalid credentials
    if user is None or not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    # Establish a login session
    request.session.clear()
    request.session["user_id"] = user["user_id"] # tells middleware which user is logged in

    # Return success
    return {
        "message": "Login successful!",
        "user": {
            "user_id": user["user_id"],
            "username": user["username"],
            "role": user["role"]
        }
    }



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



# Check whether the current session is authenticated
@router.get("/me")
def get_current_user(request: Request):

    user_id = request.session.get("user_id")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated."
        )

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        user = conn.execute(
            """
            SELECT user_id, username, role
            FROM users
            WHERE user_id = ?
            """,
            (user_id,)
        ).fetchone()

    finally:
        conn.close()

    if user is None:
        request.session.clear()
        raise HTTPException(
            status_code=401,
            detail="Not authenticated."
        )

    return dict(user)


# Log out the current user
@router.post("/logout")
def logout(request: Request):
    request.session.clear()

    return {"message": "Logged out successfully."}
