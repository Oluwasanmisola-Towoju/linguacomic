"use client";

import { type BoundingBox } from "@/lib/types";

interface BoundingBoxOverlayProps {
  boxes: BoundingBox[];
}

export function BoundingBoxOverlay({ boxes }: BoundingBoxOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {boxes.map((box) => (
        <div
          key={box.id}
          className="absolute rounded-md border border-[#90119b] bg-[#fcedfd]/15"
          style={{
            left: `${box.x * 100}%`,
            top: `${box.y * 100}%`,
            width: `${box.width * 100}%`,
            height: `${box.height * 100}%`
          }}
        >
          {box.label ? (
            <span className="absolute -top-5 left-0 rounded bg-[#90119b] px-1.5 py-0.5 text-[10px] text-white">
              {box.label}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
