from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "LingoComic API"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    debug: bool = True

    upload_dir: Path = BASE_DIR / "uploads"
    output_dir: Path = BASE_DIR / "outputs"
    font_path: Path = BASE_DIR / "static" / "fonts" / "comic.ttf"

    openai_api_key: str = ""
    translation_model: str = "gpt-4o-mini"


settings = Settings()
