from pydantic import BaseModel, EmailStr
from typing import List, Optional


class MessageTurn(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str


class ChatIn(BaseModel):
    turns: List[MessageTurn]


class ChatOut(BaseModel):
    reply: str
    citations: Optional[List[str]] = []

