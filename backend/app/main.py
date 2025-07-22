from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
import sqlite3
from youtube_transcript_api import YouTubeTranscriptApi
from groq import Groq
from dotenv import load_dotenv
from models import UserRegister, UserLogin, Transcript, AddTranscript
from database import c, conn

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@AuthJWT.load_config
def get_config():
    class Settings(BaseModel):
        authjwt_secret_key: str = os.getenv("JWT_SECRET")
    return Settings()

# Register
@app.post("/register")
def register(user: UserRegister):
    try:
        c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (user.email, user.password))
        conn.commit()
        return {"msg": "User registered successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")

# Login
@app.post("/login")
def login(user: UserLogin, Authorize: AuthJWT = Depends()):
    c.execute("SELECT id FROM users WHERE email=? AND password=?", (user.email, user.password))
    user_row = c.fetchone()
    if not user_row:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = Authorize.create_access_token(subject=user.email)
    return {"access_token": access_token, "user_id": user_row[0]}

# Free Usage Count (stored in-memory for demo)
from fastapi import Response
USAGE_LIMIT = 3
usage_counts = {}

# Get Transcript and Summary
@app.post("/summarize")
def summarize(transcript: Transcript, request: Request, response: Response, Authorize: AuthJWT = Depends()):
    user = None
    try:
        Authorize.jwt_required()
        user_email = Authorize.get_jwt_subject()
        c.execute("SELECT id FROM users WHERE email=?", (user_email,))
        user = c.fetchone()
    except AuthJWTException:
        ip = request.client.host
        usage_counts[ip] = usage_counts.get(ip, 0) + 1
        if usage_counts[ip] > USAGE_LIMIT:
            raise HTTPException(status_code=403, detail="Free summarization limit reached.")

    video_id = transcript.video_url.split("v=")[1][:11]
    transcript_text = " ".join([i['text'] for i in YouTubeTranscriptApi.get_transcript(video_id)])
    prompt = "You are a YouTube video summarizer. Summarize in bullet points (max 250 words): "
    client = Groq(api_key=groq_api_key)
    response_groq = client.chat.completions.create(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        messages=[{"role": "user", "content": prompt + transcript_text}]
    )
    summary = response_groq.choices[0].message.content

    # Store for signed-in user
    if user:
        c.execute("INSERT INTO transcripts (user_id, video_id, summary) VALUES (?, ?, ?)",
                  (user[0], video_id, summary))
        conn.commit()
    return {"summary": summary, "video_id": video_id}

# User transcript history
@app.get("/history/{user_id}")
def get_history(user_id: int):
    c.execute("SELECT id, video_id, summary, created_at FROM transcripts WHERE user_id=? ORDER BY created_at DESC", (user_id,))
    return [{"id": row[0], "video_id": row[1], "summary": row[2], "created_at": row[3]} for row in c.fetchall()]
