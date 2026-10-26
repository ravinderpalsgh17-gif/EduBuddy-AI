from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import tutor, quiz, summarizer, timetable, career

app = FastAPI(
    title="EduBuddy AI API",
    description="Backend microservice for EduBuddy AI - The AI Study Assistant & Educational Platform",
    version=settings.app_version
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include feature routers
app.include_router(tutor.router)
app.include_router(quiz.router)
app.include_router(summarizer.router)
app.include_router(timetable.router)
app.include_router(career.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "EduBuddy AI",
        "version": settings.app_version,
        "features": [
            "AI Study Assistant (/tutor)",
            "Tests and Exam Preparation (/quiz)",
            "Smart Notes (/notes)",
            "Study Timetable (/timetable)",
            "Career Guidance (/career)"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "gemini_configured": bool(settings.gemini_api_key)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
