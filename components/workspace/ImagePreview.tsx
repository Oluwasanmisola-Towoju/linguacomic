"use client";

import Image from "next/image";
import { BoundingBoxOverlay } from "@/components/workspace/BoundingBoxOverlay";
import { Loader } from "@/components/workspace/Loader";
import { type BoundingBox, type UiStatus } from "@/lib/types";

interface ImagePreviewProps {
  imageUrl: string | null;
  altText: string;
  status: UiStatus;
  boxes: BoundingBox[];
}

export function ImagePreview({ imageUrl, altText, status, boxes }: ImagePreviewProps) {
  if (!imageUrl) {
    return (
      <div className="glass-panel flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-[#e6e7ea]/30 p-6 text-sm text-slate-300">
        Upload a comic to start
      </div>
    );
  }

  return (
    <div className="glass-panel relative min-h-[420px] overflow-hidden rounded-2xl p-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#e6e7ea]/25">
        <Image src={imageUrl} alt={altText} fill className="object-contain" unoptimized />
        <BoundingBoxOverlay boxes={boxes} />
        {status === "processing" ? <Loader label="Translating comic..." /> : null}
      </div>
      {status === "success" ? (
        <p className="mt-3 inline-flex rounded-full border border-[#90119b]/40 bg-[#fcedfd]/15 px-3 py-1 text-xs text-[#fcedfd]">
          Translation complete
        </p>
      ) : null}
    </div>
  );
}
