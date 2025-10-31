import os
import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from dotenv import load_dotenv
import httpx
from models import ContactIn, ChatIn, ChatOut

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = os.getenv("MODEL", "gpt-4o-mini")
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "*").split(",")

app = FastAPI(title="AI Dr. Malik Backend", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """You are "AI Dr. Malik (Nephrology & Internal Medicine)", a clinician-facing copilot.
Guardrails:
- Not a substitute for clinical judgment; educational only. Say this on first reply in each session.
- Require key vitals, meds (dose/route/freq), allergies, and labs (BMP incl K/Cr, Mg/Phos) before renal dosing.
- If red flags (K>=6.5, pulmonary edema, anuria, EKG changes, uremic symptoms), output a RED FLAG block with immediate-action steps and stop non-urgent advice.
Evidence:
- Prefer KDIGO/KDOQI, ACC/AHA, ADA, IDSA, ACR; include citations & 'Last reviewed' date (YYYY-MM-DD).
Style:
- Structured blocks: DATA NEEDED (if missing), ASSESSMENT, PLAN, REFERENCES. Terse, options with pros/cons.
"""


async def openai_chat(turns):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + turns
    payload = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.2,
    }
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        if r.status_code != 200:
            raise HTTPException(status_code=500, detail=f"LLM error: {r.text}")
        data = r.json()
        return data["choices"][0]["message"]["content"]


@app.get("/healthz")
async def healthz():
    return {"ok": True, "time": datetime.datetime.utcnow().isoformat()}


@app.post("/api/contact")
async def contact(msg: ContactIn):
    # TODO: write to Supabase or email via SMTP; for now just accept
    return {"ok": True}


@app.post("/api/chat", response_model=ChatOut)
async def chat(body: ChatIn):
    if not OPENAI_API_KEY:
        raise HTTPException(500, "Server missing OPENAI_API_KEY")
    turns = [{"role": t.role, "content": t.content} for t in body.turns]
    reply = await openai_chat(turns)
    return {"reply": reply, "citations": []}

