import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "EduBuddy AI API"
    app_version: str = "1.0.0"
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    cors_origins: List[str] = ["*"]
    port: int = int(os.getenv("PORT", "8000"))
    host: str = os.getenv("HOST", "0.0.0.0")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
