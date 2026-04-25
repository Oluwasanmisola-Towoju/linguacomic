"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { LanguageSelector } from "@/components/workspace/LanguageSelector";
import { ImagePreview } from "@/components/workspace/ImagePreview";
import { DownloadButton } from "@/components/workspace/DownloadButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { comicApi } from "@/lib/apiClient";
import {
  type BoundingBox,
  type SupportedLanguage,
  type UiStatus
} from "@/lib/types";

export default function ComicWorkspacePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>("Nigerian Pidgin");
  const [isLoading, setIsLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [status, setStatus] = useState<UiStatus>("idle");
  const [uploadId, setUploadId] = useState<string>("");

  const activeUploadController = useRef<AbortController | null>(null);
  const activeProcessController = useRef<AbortController | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      activeUploadController.current?.abort();
      activeProcessController.current?.abort();
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const trackObjectUrl = (url: string) => {
    if (url.startsWith("blob:")) {
      objectUrlsRef.current.push(url);
    }
  };

  const replaceFile = async (nextFile: File) => {
    activeUploadController.current?.abort();
    activeProcessController.current?.abort();

    const localUrl = URL.createObjectURL(nextFile);
    trackObjectUrl(localUrl);

    setFile(nextFile);
    setPreviewUrl(localUrl);
    setProcessedImage(null);
    setBoundingBoxes([]);
    setStatus("uploading");
    setIsLoading(true);

    const controller = new AbortController();
    activeUploadController.current = controller;

    try {
      const upload = await comicApi.uploadComic(
        {
          file: nextFile,
          localPreviewUrl: localUrl
        },
        controller.signal
      );

      setUploadId(upload.uploadId);
      setBoundingBoxes(upload.boundingBoxes);
      setStatus("idle");
      toast.success("Comic uploaded successfully");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setStatus("error");
        toast.error((error as Error).message || "Upload failed");
      }
    } finally {
      setIsLoading(false);
      activeUploadController.current = null;
    }
  };

  const handleClearFile = () => {
    activeUploadController.current?.abort();
    activeProcessController.current?.abort();
    setFile(null);
    setPreviewUrl(null);
    setProcessedImage(null);
    setBoundingBoxes([]);
    setUploadId("");
    setStatus("idle");
    setIsLoading(false);
  };

  const handleTranslate = async () => {
    if (!file || !previewUrl) {
      toast.error("Upload a comic page first.");
      return;
    }

    activeProcessController.current?.abort();
    const controller = new AbortController();
    activeProcessController.current = controller;

    setStatus("processing");
    setIsLoading(true);

    try {
      const response = await comicApi.processComic(
        {
          uploadId: uploadId || `local-${Date.now()}`,
          language: selectedLanguage,
          fallbackImageUrl: previewUrl
        },
        controller.signal
      );

      setProcessedImage(response.processedImageUrl);
      if (response.boundingBoxes?.length) {
        setBoundingBoxes(response.boundingBoxes);
      }
      setStatus("success");
      toast.success(`Translated to ${selectedLanguage}`);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setStatus("error");
        toast.error((error as Error).message || "Processing failed");
      }
    } finally {
      setIsLoading(false);
      activeProcessController.current = null;
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-8 lg:flex-row">
      <Card className="w-full space-y-5 rounded-2xl p-5 lg:w-[360px] lg:shrink-0">
        <h1 className="text-xl font-semibold text-white">Comic Workspace</h1>
        <UploadDropzone
          onFileAccepted={replaceFile}
          onClearFile={handleClearFile}
          file={file}
          previewUrl={previewUrl}
          disabled={isLoading}
        />
        <LanguageSelector
          value={selectedLanguage}
          onChange={setSelectedLanguage}
          disabled={!previewUrl || isLoading}
        />
        <Button onClick={handleTranslate} disabled={!previewUrl || isLoading} className="w-full">
          {status === "processing" ? "Translating..." : "Translate Comic"}
        </Button>
        {processedImage ? (
          <DownloadButton imageUrl={processedImage} language={selectedLanguage} />
        ) : null}
      </Card>

      <div className="w-full">
        <ImagePreview
          imageUrl={processedImage ?? previewUrl}
          altText="Comic preview"
          status={status}
          boxes={boundingBoxes}
        />
      </div>
    </section>
  );
}
