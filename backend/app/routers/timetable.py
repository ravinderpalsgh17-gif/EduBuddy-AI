from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import json
from ..config import settings

router = APIRouter(prefix="/timetable", tags=["Study Timetable"])

class ScheduleRequest(BaseModel):
    available_hours_per_day: float
    target_exam_date: Optional[str] = None
    subjects: List[str]
    difficult_subjects: List[str] = []
    preferred_study_time: str = "Evening" # "Morning", "Afternoon", "Evening", "Night Owl"
    pomodoro_preference: bool = True

class StudySession(BaseModel):
    time_slot: str
    subject: str
    activity: str
    duration_mins: int
    focus_objective: str
    is_break: bool = False

class TimetablePlan(BaseModel):
    plan_name: str
    strategy_overview: str
    daily_schedule: List[StudySession]
    pomodoro_recommendation: str
    productivity_tips: List[str]

@router.post("/generate", response_model=TimetablePlan)
async def generate_timetable(req: ScheduleRequest):
    if not settings.gemini_api_key:
        sessions = []
        start_hour = 17 if req.preferred_study_time == "Evening" else 9
        for i, sub in enumerate(req.subjects):
            sessions.append(StudySession(
                time_slot=f"{start_hour:02d}:00 - {start_hour:02d}:45",
                subject=sub,
                activity="Deep Concept Revision & Practice Problems",
                duration_mins=45,
                focus_objective=f"Master fundamental equations & chapter review for {sub}.",
                is_break=False
            ))
            sessions.append(StudySession(
                time_slot=f"{start_hour:02d}:45 - {start_hour:02d}:55",
                subject="Break",
                activity="Hydrate, stretch, step away from screen",
                duration_mins=10,
                focus_objective="Cognitive reset",
                is_break=True
            ))
            start_hour += 1

        return TimetablePlan(
            plan_name="Optimized Daily Study Plan",
            strategy_overview=f"Prioritizes high-cognitive load subjects during {req.preferred_study_time} hours with spaced Pomodoro intervals.",
            daily_schedule=sessions,
            pomodoro_recommendation="45 minutes study followed by 10 minutes restorative break.",
            productivity_tips=[
                "Place your phone in another room or on Do-Not-Disturb during deep work.",
                "Review yesterday's weakest flashcards in the first 10 minutes.",
                "Stay hydrated and maintain consistent sleep hygiene."
            ]
        )

    try:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.gemini_model)
        
        prompt = f"""
Generate an optimal personalized student study timetable.
Available hours per day: {req.available_hours_per_day}
Subjects: {', '.join(req.subjects)}
Challenging subjects: {', '.join(req.difficult_subjects)}
Preferred study time: {req.preferred_study_time}
Pomodoro active: {req.pomodoro_preference}

Respond strictly in valid JSON matching:
{{
  "plan_name": "Personalized Exam Strategy Plan",
  "strategy_overview": "Strategic rationale behind session ordering and focus distribution",
  "daily_schedule": [
    {{
      "time_slot": "04:00 PM - 04:45 PM",
      "subject": "Mathematics",
      "activity": "Calculus problem sets",
      "duration_mins": 45,
      "focus_objective": "Solve 5 definite integral questions",
      "is_break": false
    }}
  ],
  "pomodoro_recommendation": "Recommended work/break ratio",
  "productivity_tips": ["Tip 1", "Tip 2", "Tip 3"]
}}
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        data = json.loads(text.strip())
        return TimetablePlan(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate timetable: {str(e)}")
