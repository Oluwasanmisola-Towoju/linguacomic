import uuid
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from app.models.schemas import DetectResponse, BoundingBox
from app.services.ocr_service import get_text_blocks
from app.services.bubble_service import detect_bubbles
from app.config import settings

router = APIRouter(prefix="/api", tags=["process"])

class DetectRequest(BaseModel):
    job_id: str
    filename: str

def _find_best_bubble(ocr_box, bubble_rects):
    """
    Find the bubble that best contains the OCR text block: preferably contours that contain the OCR center point
    then by overlap area, returns the matching bubble rect or None
    """
    ocr_cx = ocr_box["x"] + ocr_box["width"] / 2
    ocr_cy = ocr_box["y"] + ocr_box["height"] / 2

    best_rect = None
    best_score = -1

    for (bx, by, bw, bh) in bubble_rects:
        # check to see if OCR center is inside this bubble's coordinates
        if bx <= ocr_cx <= bx + bw and by <= ocr_cy <= by + bh:
            # the score given shoulkd be based on how well the OCR box fits inside 
            score = 1 / (bw * bh)
            if score > best_score:
                best_score = score
                best_rect = (bx, by, bw, bh)
    
    return best_rect

@router.post("/detect", response_model=DetectResponse)
async def detect(req: DetectRequest):
    # locate the uploaded file
    upload_path = None
    for ext in [".jpg", ".jpeg", ".png", ".webp"]:
        candidate = Path(settings.upload_dir) / f"{req.job_id}{ext}"
        if candidate.exists():
            upload_path = candidate
            break

    if not upload_path:
        raise HTTPException(status_code=404, detail=f"No image found for job_id: {req.job_id}")
    
    image_path_str = str(upload_path)

    # use ocr
    try: 
        text_blocks = get_text_blocks(image_path_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")
    
    if not text_blocks:
        raise HTTPException(status_code=422, detail="No text detected in image. Ensure that the uploaded comic has clear, readable text.")
    
    # bubble detection
    warning = None
    try: 
        bubble_rects = detect_bubbles(image_path_str)
    except Exception as e:
        # fall back to OCR boxes only
        bubble_rects = []
        warning = f"Bubble detection failed ({str(e)}). Using OCR regions directly."
    
    # get image dimensions 
    from PIL import Image
    with Image.open(image_path_str) as img:
        img_width, img_height = img.size
    
    # merge OCR text into bubble regions
    bubbles: List[BoundingBox] = []

    for block in text_blocks:
        ocr_dict = {"x": block.x,
                    "y": block.y,
                    "width": block.width,
                    "height": block.height
                    }
        best = _find_best_bubble(ocr_dict, bubble_rects) if bubble_rects else None

        if best:
            bx, by, bw, bh = best
        else:
            # fall back to OCR bounding box with a small padding
            pad = 8
            bx = max(0, block.x - pad)
            by = max(0, block.y - pad)
            bw = min(img_width - bx, block.width + pad * 2)
            bh = min(img_height - by, block.height + pad * 2)

        bubbles.append(BoundingBox(
            id=str(uuid.uuid4())[:8],  # short UUID for frontend mapping use
            x=bx,
            y=by,
            width=bw,
            height=bh,
            text=block.text,
            confidence=block.confidence, 
        ))

    if not bubbles:
        raise HTTPException(status_code=422, detail="Could not map detected text to any speech bubbles.")
    
    return DetectResponse(
        job_id=req.job_id,
        image_url=f"/api/images/{upload_path.name}",
        image_width=img_width,
        image_height=img_height,
        bubbles=bubbles,
        bubble_count=len(bubbles),
        warning=warning,
    )