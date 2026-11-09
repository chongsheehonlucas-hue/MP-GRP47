from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal
from httpx import ConnectError, ReadTimeout
from ollama import ResponseError

from services.ai_service import generate_ai_response

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    mode: Literal["qa", "scenario"] = "qa"


@router.post("/chat")
def ask_chatbot(data: ChatRequest):
    try:
        answer = generate_ai_response(
            message=data.message,
            mode=data.mode
        )

        return {
            "mode": data.mode,
            "response": answer
        }

    except (ConnectError, ReadTimeout):
        raise HTTPException(
            status_code=503,
            detail="AI service is unavailable."
        )

    except ResponseError:
        raise HTTPException(
            status_code=502,
            detail="AI model could not process the request."
        )
