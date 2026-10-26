from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import json
from ..config import settings

router = APIRouter(prefix="/notes", tags=["Smart Notes"])

class NoteSummaryRequest(BaseModel):
    title: Optional[str] = "Untitled Notes"
    raw_text: str
    target_length: Optional[str] = "concise" # "concise", "detailed", "bullet_points", "flashcard_ready"
    subject: Optional[str] = "General"

class NoteSummaryResponse(BaseModel):
    title: str
    summary: str
    key_points: List[str]
    important_terms: List[dict]  # [{"term": "Mitosis", "definition": "..."}]
    high_yield_exam_tips: List[str]
    study_time_estimate_mins: int

@router.post("/summarize", response_model=NoteSummaryResponse)
async def summarize_notes(req: NoteSummaryRequest):
    if not settings.gemini_api_key:
        lines = [line.strip() for line in req.raw_text.split("\n") if line.strip()]
        first_sentence = lines[0] if lines else "Summary of study material."
        return NoteSummaryResponse(
            title=req.title or "Study Notes Summary",
            summary=f"Overview: {first_sentence[:200]}...",
            key_points=[
                "Key Concept 1: Core thesis and primary mechanism identified in notes.",
                "Key Concept 2: Essential formulas, historical dates, or structural definitions.",
                "Key Concept 3: Practical exam relevance and high-frequency problem areas."
            ],
            important_terms=[
                {"term": "Core Concept", "definition": "The central idea emphasized across the text."},
                {"term": "Application", "definition": "How this concept is tested on standard exams."}
            ],
            high_yield_exam_tips=[
                "Focus on the relationship between causes and effects.",
                "Review definitions right before attempting mock tests."
            ],
            study_time_estimate_mins=15
        )

    try:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.gemini_model)
        
        prompt = f"""
You are an expert academic note summarizer for students.
Title: {req.title}
Subject: {req.subject}
Format: {req.target_length}

Notes to process:
\"\"\"{req.raw_text}\"\"\"

Generate a high-yield summary formatted strictly as JSON with:
{{
  "title": "{req.title}",
  "summary": "Clear, concise 2-3 paragraph summary distilling the main concepts",
  "key_points": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "important_terms": [
    {{"term": "Term Name", "definition": "Clear concise definition for flashcard revision"}}
  ],
  "high_yield_exam_tips": [
    "Exam tip 1", "Exam tip 2"
  ],
  "study_time_estimate_mins": 20
}}
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        data = json.loads(text.strip())
        return NoteSummaryResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to summarize notes: {str(e)}")
