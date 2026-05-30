"""
Bubble detection service using OpenCV
Handles image processing to find speech bubble contours
"""

import cv2
import numpy as np
from pathlib import Path
from typing import List, Tuple

# I put this here so that variables could be adjusted if bubble detction is over/under-detecting on comic style

# Minimum Bubble area as fraction of total image area
MIN_AREA_FRACTION = 0.005 # approx 0.5% filters out tiny noise

# Maximum bubble area as fraction (ignore full-page panels)
MAX_AREA_FRACTION = 0.40  # 40%

# How much to expand each detected bounding box (pixels) to include bubble borders
EXPAND_PX = 8

# Merge bubbles whose boxes overlap by more than this fraction of the smaller box.
MERGE_OVERLAP_THRESHOLD = 0.2

Rect = Tuple[int, int, int, int] # This take in (x, y, w, h) 

def detect_bubbles(image_path: str) -> List[Rect]:
    """
    Returns a list of (x, y, w, h) bounding rectangles for detected speech bubbles
    """

    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Cannot read image: {image_path}")
    
    H, W = img.shape[:2]
    image_area = H * W

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # adaptive threshold: finds light regions on varied backgrounds.
    # blockSize and C are used for different art styles so they can be tuned
    thresh = cv2.adaptiveThreshold(
        blurred,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        blockSize=15,
        C=2
    )

    # Invert: bubbles should be white on potentially complex background
    # After invert: bubbles become white foreground
    inverted = cv2.bitwise_not(thresh)

    # filling small holes (like text) inside bubble regions using Morphological closing 
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    closed = cv2.morphologyEx(inverted, cv2.MORPH_CLOSE, kernel, iterations=2)

    # Extract contours from the processed image
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    rects: List[Rect] = []
    for contour in contours:
        area = cv2.contourArea(contour)
        area_frac = area / image_area

        if area_frac < MIN_AREA_FRACTION or area_frac > MAX_AREA_FRACTION: 
            continue

        x, y, w, h = cv2.boundingRect(contour)

        # filtering extreme aspect ratios
        aspect = w / h if h > 0 else 0
        if aspect > 8 or aspect < 0.1:
            continue
    
        # expanding the box and clamp to image bounds
        x = max(0, x - EXPAND_PX)
        y = max(0, y - EXPAND_PX)
        w = min(W - x, w + EXPAND_PX * 2)
        h = min(H - y, h + EXPAND_PX * 2)

        rects.append((x, y, w, h))

    return _merge_overlapping(rects)

def _iou(a: Rect, b: Rect) -> float:
    """ Intersection over Union for two rects """
    ax, ay, aw, ah = a 
    bx, by, bw, bh = b

    ix = max(ax, bx)
    iy = max(ay, by)
    iw = min(ax + aw, bx + bw) - ix
    ih = min(ax + ah, by + bh) - iy

    if iw <= 0 or ih <= 0:
        return 0.0
    
    inter = iw * ih
    union = aw * ah + bw * bh - inter
    return inter / union if union > 0 else 0.0

def _merge_overlapping(rects: List[Rect]) -> List[Rect]:
    """
    Interactively merge any two rects whose IoU exceeds the threshold andd stop when no merges remain
    """
    changed = True
    while changed: 
        changed = False
        merged: List[Rect] = []
        used = [False] * len(rects)

        for i, a in enumerate(rects):
            if used[i]:
                continue
            for j, b in enumerate(rects):
                if i == j or used[j]:
                    continue
                if _iou(a, b) > MERGE_OVERLAP_THRESHOLD:
                    # merge into a bounding rect that covers both
                    ax, ay, aw, ah = a
                    bx, by, bw, bh = b
                    mx = min(ax, bx)
                    my = min(ay, by)
                    mw = max(ax + aw, bx + bw) - mx
                    mh = max(ay + ah, by + bh) - my
                    a = (mx, my, mw, mh)
                    used[j] = True
                    changed = True
            
            merged.append(a)
            used[i] = True
        
        rects = merged
    
    return rects