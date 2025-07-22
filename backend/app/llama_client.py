import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
API_URL = "https://api.groq.com/openai/v1/chat/completions"

def summarize_with_llama(transcript: str) -> str:
    prompt = (
        "You are a YouTube video summarizer. Summarize the following transcript "
        "in bullet points under 250 words:\n\n" + transcript
    )

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "meta-llama/llama-4-maverick-17b-128e-instruct",
        "messages": [
            {"role": "system", "content": "You are a helpful AI that summarizes videos."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    response = httpx.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        raise Exception(f"Groq API error: {response.status_code} - {response.text}")
