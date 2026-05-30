"""
OCR Service using Google Cloud Vision
responsible only for image -- list of text blocks with bounding boxes if you wish to swap to a different OCR provider, you should only need to reimplement _detect_with_gcv() oorrr you could just add a new _detect_with_X() function
also update the get_text_blocks() to call the new function 
finally ensure the return shape  matches TextBlock
"""

import os
import io
from dataclasses import dataclass
from typing import List, Optional
from pathlib import Path

@dataclass
class TextBlock:
    """ Represents a block of text detected in the image. """
    text: str
    x: int
    y: int
    width: int
    height: int
    confidence: float  # Confidence score for the detected text block GCV doesn't expose this directly so i set default to 0.9

def get_text_blocks(image_path: str) -> List[TextBlock]:
    """Extracts text blocks from the given image using Google Cloud Vision API.
       Falls back to a mock if GCV credentials are not set.
    """
    creds_path = os.getenv('GOOGLE_CLOUD_CREDENTIALS', "")
    if creds_path and Path(creds_path).exists():
        return _detect_with_gcv(image_path)
    else:
        print("[OCR WARNING]: GCV credentials not found. Returning Mock Data.")
        return _mock_blocks(image_path)
    
def _detect_with_gcv(image_path: str) -> List[TextBlock]:
    """ Call Google Cloud Vision document_text_detection API to extract text blocks. """
    from google.cloud import vision
    from google.oauth2 import service_account

    creds_path = os.getenv('GOOGLE_CLOUD_CREDENTIALS')
    credentials = service_account.Credentials.from_service_account_file(creds_path)
    client = vision.ImageAnnotatorClient(credentials=credentials)

    with open(image_path, 'rb') as img_file:
        content = img_file.read()

    image = vision.Image(content=content)
    response = client.document_text_detection(image=image)

    if response.error.message:
        raise RuntimeError(f"GCV API error: {response.error.message}")
    
    blocks: List[TextBlock] = []
    for page in response.full_text_annotation.pages:
        for block in page.blocks:
            # Each block corresponds roughly to one speech bubble's text
            # Extract the block's bounding box and concatenate all paragraph text.
            
            verts = block.bounding_box.vertices
            xs = [v.x for v in verts]
            ys = [v.y for v in verts]
            x, y = min(xs), min(ys)
            w, h = max(xs) - x, max(ys) - y

            # concatenate all text in this block
            block_text_parts = []
            for para in block.paragraphs:
                para_text = ""
                for word in para.words:
                    word_text = "".join(s.text for s in word.symbols)

                    # GCV puts space or a newline info in the symbol break type
                    last_symbol = word.symbols[-1] if word.symbols else None
                    if last_symbol and getattr(last_symbol.property, 'detected_break', None):
                        break_type = last_symbol.property.detected_break.type

                        # types 1, 2 -> space, sure_space (sure why they have 2 types for space but whatever)
                        # type 3 -> EOL 
                        # type 4 -> hyphen
                        # type 5 -> line break
                        if break_type in (1, 2):
                            word_text += " "
                        elif break_type in (3, 4, 5):
                            word_text += "\n"

                    para_text += word_text

                block_text_parts.append(para_text.strip())

            full_text = " ".join(block_text_parts).strip()
            if not full_text or w < 10 or h < 10:
                continue

            blocks.append(TextBlock(
                text=full_text,
                x=x,
                y=y,
                width=w,
                height=h,
                confidence=0.9
            ))
    return blocks

def _mock_blocks(image_path: str) -> List[TextBlock]:
    """
    Returns sysnthetic text blocks for development without GCV credentials
    positions are expressed as fractions of image size so that they will always be visible
    """
    from PIL import Image
    img = Image.open(image_path)
    W, H = img.size

    return [
        TextBlock(text="Wait — did you hear that?", x=int(W*0.05), y=int(H*0.05), width=int(W*0.35), height=int(H*0.12), confidence=0.95),
        TextBlock(text="Yes. Something moved in the shadows.", x=int(W*0.55), y=int(H*0.08), width=int(W*0.38), height=int(H*0.14), confidence=0.92),
        TextBlock(text="We need to move. NOW.", x=int(W*0.10), y=int(H*0.55), width=int(W*0.32), height=int(H*0.10), confidence=0.97),
        TextBlock(text="But what about the others?", x=int(W*0.58), y=int(H*0.60), width=int(W*0.35), height=int(H*0.10), confidence=0.93),
    ]