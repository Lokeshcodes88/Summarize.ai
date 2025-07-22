from pydantic import BaseModel

class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Transcript(BaseModel):
    video_url: str

class AddTranscript(BaseModel):
    video_id: str
    summary: str
    user_id: int
