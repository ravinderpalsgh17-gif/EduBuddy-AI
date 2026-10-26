from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import json
from ..config import settings

router = APIRouter(prefix="/quiz", tags=["Tests and Exam Preparation"])

class QuizRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str = "Medium"  # Easy, Medium, Hard
    question_count: int = 5
    question_type: str = "multiple_choice" # multiple_choice, true_false, flashcards

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer_index: int
    explanation: str
    hint: Optional[str] = None

class QuizResponse(BaseModel):
    subject: str
    topic: str
    difficulty: str
    questions: List[QuizQuestion]

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(req: QuizRequest):
    if not settings.gemini_api_key:
        # Fallback offline generator
        return QuizResponse(
            subject=req.subject,
            topic=req.topic,
            difficulty=req.difficulty,
            questions=[
                QuizQuestion(
                    id=1,
                    question=f"What is the primary significance of {req.topic} in {req.subject}?",
                    options=[
                        f"It serves as a foundational core principle",
                        f"It has been deprecated and is no longer used",
                        f"It only applies under zero gravity conditions",
                        f"It cannot be measured experimentally"
                    ],
                    correct_answer_index=0,
                    explanation=f"{req.topic} is considered foundational in {req.subject} study.",
                    hint="Think about foundational principles."
                ),
                QuizQuestion(
                    id=2,
                    question=f"Which method is most commonly applied when analyzing {req.topic}?",
                    options=[
                        "Random trial and error without metrics",
                        "Systematic step-by-step analytical modeling",
                        "Ignoring boundary conditions completely",
                        "Relying solely on outdated historical assumptions"
                    ],
                    correct_answer_index=1,
                    explanation="Rigorous analytical modeling is standard for testing and exam prep.",
                    hint="Consider modern scientific and academic methods."
                )
            ]
        )

    try:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.gemini_model)
        
        prompt = f"""
Generate an exam preparation quiz for students.
Subject: {req.subject}
Topic: {req.topic}
Difficulty: {req.difficulty}
Count: {req.question_count}

Output strictly valid JSON with this structure:
{{
  "subject": "{req.subject}",
  "topic": "{req.topic}",
  "difficulty": "{req.difficulty}",
  "questions": [
    {{
      "id": 1,
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer_index": 0,
      "explanation": "Clear explanation of why option A is correct and why other options are incorrect.",
      "hint": "Helpful subtle hint for the student"
    }}
  ]
}}
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        data = json.loads(text.strip())
        return QuizResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")
