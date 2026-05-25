from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    google_cloud_credentials: str = ""
    openai_api_key: str = ""
    upload_dir: str = "./storage/uploads"
    output_dir: str = "./storage/outputs"
    max_file_size_mb: int = 20
    allowed_origins: str = "http://localhost:5173"

    class Config:
        # tells pydantic to automatically look for a .env file to populate these variables
        env_file = ".env"
        
# Instantiate a global settings object to import across the app
settings = Settings()