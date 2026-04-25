import {
  type BoundingBox,
  type ProcessComicInput,
  type ProcessComicResponse,
  type UploadComicInput,
  type UploadComicResponse
} from "@/lib/types";

const MOCK_BOXES: BoundingBox[] = [
  { id: "b1", x: 0.12, y: 0.14, width: 0.26, height: 0.14, label: "Bubble 1" },
  { id: "b2", x: 0.52, y: 0.24, width: 0.3, height: 0.15, label: "Bubble 2" },
  { id: "b3", x: 0.2, y: 0.58, width: 0.35, height: 0.16, label: "Bubble 3" }
];

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Request aborted", "AbortError"));
    });
  });
}

export async function uploadComic(
  input: UploadComicInput,
  signal?: AbortSignal
): Promise<UploadComicResponse> {
  await delay(700, signal);

  return {
    uploadId: `mock-${Date.now()}`,
    imageUrl: input.localPreviewUrl,
    boundingBoxes: MOCK_BOXES
  };
}

export async function processComic(
  input: ProcessComicInput,
  signal?: AbortSignal
): Promise<ProcessComicResponse> {
  await delay(1400, signal);

  return {
    processedImageUrl: input.fallbackImageUrl,
    translatedLabels: MOCK_BOXES.map(
      (box) => `${box.label ?? "Bubble"} (${input.language})`
    ),
    boundingBoxes: MOCK_BOXES
  };
}
