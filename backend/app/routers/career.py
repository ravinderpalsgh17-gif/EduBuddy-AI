from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import json
from ..config import settings

router = APIRouter(prefix="/career", tags=["Career Guidance"])

class CareerAdviceRequest(BaseModel):
    favorite_subjects: List[str]
    interests: List[str]
    strengths: List[str]
    work_environment_preference: Optional[str] = "Collaborative & Tech-focused"
    target_education_level: Optional[str] = "Bachelor's Degree or Higher"

class CareerPath(BaseModel):
    career_title: str
    match_percentage: int
    description: str
    high_school_subjects: List[str]
    college_degrees: List[str]
    essential_skills: List[str]
    industry_demand_outlook: str
    recommended_starter_projects: List[str]

class CareerGuidanceResponse(BaseModel):
    summary_profile: str
    recommended_careers: List[CareerPath]
    next_action_steps: List[str]

@router.post("/recommend", response_model=CareerGuidanceResponse)
async def get_career_recommendations(req: CareerAdviceRequest):
    if not settings.gemini_api_key:
        return CareerGuidanceResponse(
            summary_profile=f"Analytical and curious profile with strong alignment toward STEM and creative problem solving.",
            recommended_careers=[
                CareerPath(
                    career_title="AI & Machine Learning Engineer",
                    match_percentage=95,
                    description="Builds, trains, and deploys intelligent models that automate complex reasoning, vision, and natural language.",
                    high_school_subjects=["Advanced Mathematics / Calculus", "Computer Science", "Physics"],
                    college_degrees=["B.S. in Computer Science", "Data Science", "Software Engineering"],
                    essential_skills=["Python", "Linear Algebra", "PyTorch / TensorFlow", "Data Structures"],
                    industry_demand_outlook="Rapidly growing with exceptionally high global demand across tech, finance, and healthcare.",
                    recommended_starter_projects=[
                        "Train a simple image classifier with PyTorch",
                        "Build an AI study buddy chatbot with LLM APIs"
                    ]
                ),
                CareerPath(
                    career_title="Biomedical Data Scientist",
                    match_percentage=88,
                    description="Combines biological domain expertise with computational genomics to discover medicines and treat diseases.",
                    high_school_subjects=["Biology", "Chemistry", "Mathematics", "Statistics"],
                    college_degrees=["Bioinformatics", "Biomedical Engineering", "Computational Biology"],
                    essential_skills=["Genomics", "R & Python", "Biostatistics", "Molecular Biology"],
                    industry_demand_outlook="High demand in pharmaceuticals, biotechnology, and personalized healthcare.",
                    recommended_starter_projects=[
                        "Analyze open-source genomic sequencing data from NCBI",
                        "Simulate protein folding dynamics using web-based tools"
                    ]
                )
            ],
            next_action_steps=[
                "Shadow a professional or conduct 2 informational interviews in your top industry.",
                "Start building a portfolio project showcasing real-world problem solving.",
                "Choose high school electives and AP/IB courses aligned with your target degree."
            ]
        )

    try:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.gemini_model)
        
        prompt = f"""
Act as an empathetic, knowledgeable academic and career counselor.
Student Profile:
- Favorite Subjects: {', '.join(req.favorite_subjects)}
- Interests & Hobbies: {', '.join(req.interests)}
- Core Strengths: {', '.join(req.strengths)}
- Preferred Work Environment: {req.work_environment_preference}

Generate personalized career pathways and academic roadmaps in JSON:
{{
  "summary_profile": "Synthesized analysis of student strengths and academic personality",
  "recommended_careers": [
    {{
      "career_title": "Title",
      "match_percentage": 92,
      "description": "Comprehensive explanation of role",
      "high_school_subjects": ["Subject 1", "Subject 2"],
      "college_degrees": ["Degree 1", "Degree 2"],
      "essential_skills": ["Skill 1", "Skill 2"],
      "industry_demand_outlook": "Job market projection",
      "recommended_starter_projects": ["Project 1", "Project 2"]
    }}
  ],
  "next_action_steps": ["Action step 1", "Action step 2", "Action step 3"]
}}
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        data = json.loads(text.strip())
        return CareerGuidanceResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate career guidance: {str(e)}")
