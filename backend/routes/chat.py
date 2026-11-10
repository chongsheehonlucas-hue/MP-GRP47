
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal
from httpx import ConnectError, ReadTimeout
from ollama import ResponseError

from services.ai_service import generate_ai_response

router = APIRouter()


# Represents one message in the conversation
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=30000)


# Represents a chatbot request
class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    mode: Literal["qa", "scenario"] = "qa"

    # Previous messages, empty for a new conversation
    history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=12,
        
    )


@router.post("/chat")
def ask_chatbot(data: ChatRequest):
    try:
        # Convert previous messages into dictionaries
        previous_messages = [
            msg.model_dump() for msg in data.history
        ]

        # Send the conversation to Qwen
        answer = generate_ai_response(
            message=data.message,
            mode=data.mode,
            history=previous_messages
        )

        # Add the latest question and answer
        updated_history = previous_messages + [
            {
                "role": "user",
                "content": data.message
            },
            {
                "role": "assistant",
                "content": answer
            }
        ]

        # Keep the latest 12 messages
        updated_history = updated_history[-12:]

        return {
            "mode": data.mode,
            "response": answer,
            "history": updated_history
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
