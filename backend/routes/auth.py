from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# expected login feilds

class LoginRequest(BaseModel):
    username: str
    password: str

# login endpoint
@router.post("/login") #when the user clicks login button, the frontend will send a post request to this endpoint with the username and password
def login(credentials: LoginRequest):

# Authentication is not implemented yet
    raise HTTPException(
        status_code=501,
        detail="Login API connected!."
    )
