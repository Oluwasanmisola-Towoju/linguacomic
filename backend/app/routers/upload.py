import uuid
import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from PIL import Image
import io

from app.models.schemas import UploadResponse
from app.config import settings

router = APIRouter(prefix="/api", tags=["upload"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_BYTES = settings.max_file_size_mb * 1024 * 1024

@router.post("/upload", response_model=UploadResponse)
async def upload_comic(file: UploadFile = File(...)):

    #validate the file (MIME) type early to save processing timne
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {file.content_type}. Use JPEG, PNG or WebP. "
        )

    # read file into memory and then validate the file size
    contents = await file.read()
    if len(contents) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.max_file_size_mb} MB."
        )
    
    # validate if the image is actually a readable one
    try:
        #load bytes into virtual file object
        img = Image.open(io.BytesIO(contents))
        img.verify()  # Verify that it's an image
        img = Image.open(io.BytesIO(contents))  # Reopen to get dimensions
        width, height = img.size
    except Exception:
        raise HTTPException(
            status_code=422,
            detail="File is not a valid image."
        )
    
    # generate a unique job id and save
    job_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix.lower() or ".jpg" # Default to .jpg if no extension
    save_filename = f"{job_id}{ext}"
    save_path = Path(settings.upload_dir) / save_filename

    save_path.parent.mkdir(parents=True, exist_ok=True)  # Ensure upload directory exists
    save_path.write_bytes(contents)

    return UploadResponse(
        job_id=job_id,
        filename=file.filename,
        image_url=f"/api/images/{save_filename}",
        width=width,
        height=height,
        message="Upload successful"
    )

@router.get("/images/{filename}")
async def serve_image(filename: str):
    """ Server uploaded or processed images. """
    #check uploads first, then fallback to outputs 
    for directory in [settings.upload_dir, settings.output_dir]:
        file_path = Path(directory) / filename
        
        # ensures that the file exists and is a file (not a directory) before serving
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        
    raise HTTPException(
        status_code=404,
        detail="Image not found."
    )