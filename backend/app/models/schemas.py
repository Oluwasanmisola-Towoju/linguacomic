from pydantic import BaseModel
from typing import Optional

class UploadResponse(BaseModel):
    job_id: str
    filename: str
    image_url: str
    width: int
    height: int
    message: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None