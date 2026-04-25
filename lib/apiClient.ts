import {
  type ApiErrorPayload,
  type ComicApiService,
  type ProcessComicInput,
  type ProcessComicResponse,
  type UploadComicInput,
  type UploadComicResponse
} from "@/lib/types";
import * as mockApi from "@/lib/mockApi";

const apiMode = process.env.NEXT_PUBLIC_API_MODE ?? "mock";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function parseError(response: Response): Promise<Error> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    const message = payload.error?.message ?? `Request failed (${response.status})`;
    return new Error(message);
  } catch {
    return new Error(`Request failed (${response.status})`);
  }
}

const liveApi: ComicApiService = {
  async uploadComic(input: UploadComicInput, signal?: AbortSignal): Promise<UploadComicResponse> {
    if (!apiBaseUrl) {
      throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for live mode.");
    }

    const form = new FormData();
    form.append("file", input.file);

    const response = await fetch(`${apiBaseUrl}/api/comics/upload`, {
      method: "POST",
      body: form,
      signal
    });

    if (!response.ok) {
      throw await parseError(response);
    }

    return (await response.json()) as UploadComicResponse;
  },
  async processComic(
    input: ProcessComicInput,
    signal?: AbortSignal
  ): Promise<ProcessComicResponse> {
    if (!apiBaseUrl) {
      throw new Error("Missing NEXT_PUBLIC_API_BASE_URL for live mode.");
    }

    const response = await fetch(`${apiBaseUrl}/api/comics/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uploadId: input.uploadId,
        language: input.language
      }),
      signal
    });

    if (!response.ok) {
      throw await parseError(response);
    }

    return (await response.json()) as ProcessComicResponse;
  }
};

export const comicApi: ComicApiService =
  apiMode === "live" && apiBaseUrl ? liveApi : mockApi;

export async function downloadImage(url: string, filename: string): Promise<void> {
  const isBlobUrl = url.startsWith("blob:");
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (isBlobUrl) {
    return;
  }
}
