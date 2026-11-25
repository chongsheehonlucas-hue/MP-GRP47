
import sqlite3

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

from routes.auth import DB_PATH, password_hasher

router = APIRouter()


class ProfileUpdate(BaseModel):
    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=50,
        pattern=r"^[A-Za-z0-9_]+$"
    )

    email: EmailStr | None = None

    current_password: str = Field(min_length=1)

    new_password: str | None = Field(
        default=None,
        min_length=12,
        max_length=128
    )


# Retrieve user info
@router.get("/profile")
def get_profile(request: Request):

    user_id = request.session.get("user_id")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Please log in first."
        )

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        user = conn.execute(
            """
            SELECT user_id, username, email, role
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
            detail="Account not found."
        )

    return dict(user)


# Update user info
@router.patch("/profile")
def update_profile(data: ProfileUpdate, request: Request):

    user_id = request.session.get("user_id")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Please log in first."
        )

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        user = conn.execute(
            """
            SELECT user_id, username, email, password_hash, role
            FROM users
            WHERE user_id = ?
            """,
            (user_id,)
        ).fetchone()

        if user is None:
            request.session.clear()
            raise HTTPException(
                status_code=401,
                detail="Account not found."
            )

        # Verify the user's existing password
        if not password_hasher.verify(
            data.current_password,
            user["password_hash"]
        ):
            raise HTTPException(
                status_code=403,
                detail="Current password is incorrect."
            )

        # Retain existing values if not updated
        new_username = (
            data.username
            if data.username is not None
            else user["username"]
        )

        new_email = (
            str(data.email).lower()
            if data.email is not None
            else user["email"]
        )

        new_password_hash = user["password_hash"]

        # Hash new password
        if data.new_password is not None:
            new_password_hash = password_hasher.hash(
                data.new_password
            )

        try:
            conn.execute(
                """
                UPDATE users
                SET username = ?,
                    email = ?,
                    password_hash = ?
                WHERE user_id = ?
                """,
                (
                    new_username,
                    new_email,
                    new_password_hash,
                    user_id
                )
            )

            conn.commit()

        except sqlite3.IntegrityError:
            conn.rollback()
            raise HTTPException(
                status_code=409,
                detail="Username or email already exists."
            )

        # Log out after a password change
        password_changed = data.new_password is not None

        if password_changed:
            request.session.clear()

        return {
            "message": (
                "Profile updated. Please log in again."
                if password_changed
                else "Profile updated successfully!"
            ),
            "requires_login": password_changed,
            "user": {
                "user_id": user_id,
                "username": new_username,
                "email": new_email,
                "role": user["role"]
            }
        }

    finally:
        conn.close()
