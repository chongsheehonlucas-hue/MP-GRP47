from ollama import chat

MODEL = "qwen3:4b-instruct"

SYSTEM_PROMPTS = {
    "qa": (
        "You are an educational digital forensics assistant. "
        "Answer questions about digital forensics clearly and "
        "accurately. Explain technical terms in simple language. "
        "If you are uncertain, acknowledge it. Do not invent "
        "legal requirements or forensic standards."
    ),

    "scenario": (
        "You are a digital forensics case scenario generator. "
        "Create realistic but entirely fictional investigation "
        "scenarios for educational purposes. "
        "Include a case background, investigation objectives, "
        "available evidence, and three questions for learners. "
        "Do not reveal the answer key or solutions yet."
    )
}



def generate_ai_response(
    message: str,
    mode: str,
    history: list[dict] | None = None
):
    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPTS[mode]
        }
    ]

    # Add previous conversation messages
    if history:
        messages.extend(history)
 
    # Add the user's newest question
    messages.append({
        "role": "user",
        "content": message
    })

    response = chat(
        model=MODEL,
        messages=messages
    )

    return response.message.content
