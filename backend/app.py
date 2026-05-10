from pathlib import Path
from uuid import uuid4

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from config import settings
from schemas import OCRBox, ProcessResponse
from services.image_service import draw_debug_boxes, erase_original_text
from services.ocr_service import detect_text_boxes
from services.render_service import render_translations
from services.translation_service import translate_text