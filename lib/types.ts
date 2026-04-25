export type SupportedLanguage =
  | "Nigerian Pidgin"
  | "Yoruba"
  | "Swahili"
  | "French"
  | "Spanish";

export type UiStatus = "idle" | "uploading" | "processing" | "success" | "error";

export interface BoundingBox {
  id: string;
  x: number; // normalized 0-1
  y: number; // normalized 0-1
  width: number; // normalized 0-1
  height: number; // normalized 0-1
  label?: string;
}

export interface UploadComicResponse {
  uploadId: string;
  imageUrl: string;
  boundingBoxes: BoundingBox[];
}

export interface ProcessComicResponse {
  processedImageUrl: string;
  translatedLabels: string[];
  boundingBoxes?: BoundingBox[];
}

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface UploadComicInput {
  file: File;
  localPreviewUrl: string;
}

export interface ProcessComicInput {
  uploadId: string;
  language: SupportedLanguage;
  fallbackImageUrl: string;
}

export interface ComicApiService {
  uploadComic(input: UploadComicInput, signal?: AbortSignal): Promise<UploadComicResponse>;
  processComic(input: ProcessComicInput, signal?: AbortSignal): Promise<ProcessComicResponse>;
}
