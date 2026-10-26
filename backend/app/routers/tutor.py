from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import google.generativeai as genai
from ..config import settings

router = APIRouter(prefix="/tutor", tags=["AI Study Assistant"])

class QuestionRequest(BaseModel):
    subject: str
    topic: str
    question: str
    explanation_level: Optional[str] = "High School"  # "ELI5", "High School", "College", "Exam Revision"
    chat_history: Optional[List[dict]] = []

class TutorResponse(BaseModel):
    explanation: str
    step_by_step: List[str]
    analogy: str
    key_takeaway: str
    suggested_followups: List[str]

@router.post("/explain", response_model=TutorResponse)
async def explain_topic(req: QuestionRequest):
    if not settings.gemini_api_key:
        # Fallback offline structured explanation
        return TutorResponse(
            explanation=f"Here is a comprehensive breakdown of {req.topic} ({req.subject}):",
            step_by_step=[
                f"1. Core Definition: {req.topic} represents a fundamental concept in {req.subject}.",
                f"2. Mechanism: It operates by structured principles and rules.",
                f"3. Practical Application: Students encounter this in problem-solving and real-world systems.",
                f"4. Common Pitfalls: Ensure to double-check prerequisite formulas and foundational vocabulary."
            ],
            analogy=f"Think of {req.topic} like building blocks in an arch: each concept supports the final structure.",
            key_takeaway=f"Master the core mechanism of {req.topic} first before tackling complex edge cases.",
            suggested_followups=[
                f"Can you give me a practice problem on {req.topic}?",
                f"What are the most common exam questions for {req.topic}?",
                f"How does {req.topic} connect to advanced topics?"
            ]
        )

    try:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.gemini_model)
        
        prompt = f"""
You are EduBuddy AI, a patient, encouraging, and brilliant study assistant.
Subject: {req.subject}
Topic: {req.topic}
Student Explanation Level: {req.explanation_level}
Student Question: {req.question}

Respond strictly in valid JSON format with keys:
- "explanation": (A clear, concise, conversational explanation tailored to the requested level)
- "step_by_step": (An array of 3-5 strings explaining the concept or solution step by step)
- "analogy": (A memorable real-world analogy that makes the concept click)
- "key_takeaway": (One powerful sentence summarizing the main point)
- "suggested_followups": (3 smart follow-up questions the student might want to ask next)
Do not enclose in markdown blocks if possible, just raw JSON.
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        
        import json
        data = json.loads(text.strip())
        return TutorResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation error: {str(e)}")
