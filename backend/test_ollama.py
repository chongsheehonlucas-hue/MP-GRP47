from ollama import chat

MODEL = "qwen3:4b-instruct"

question = input("Ask your Digital Forensics AI: ")

response = chat(
    model=MODEL,
    messages=[
        {
            "role": "system",
            "content": (
                "You are a digital forensics educational assistant. "
                "Explain forensic concepts clearly and accurately. "
                "You can generate realistic but fictional digital "
                "forensics investigation scenarios for learners. "
                "Do not invent legal requirements or present "
                "uncertain information as established fact."
            )
        },
        {
            "role": "user",
            "content": question
        }
    ]
)

print("\nAI Response:\n")
print(response.message.content)
