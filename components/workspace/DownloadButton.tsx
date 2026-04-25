"use client";

import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/apiClient";

interface DownloadButtonProps {
  imageUrl: string;
  language: string;
}

export function DownloadButton({ imageUrl, language }: DownloadButtonProps) {
  const handleDownload = async () => {
    const normalizedLanguage = language.toLowerCase().replace(/\s+/g, "-");
    const filename = `lingocomic-${normalizedLanguage}-processed.png`;
    await downloadImage(imageUrl, filename);
  };

  return (
    <Button variant="secondary" onClick={handleDownload}>
      Download Processed Image
    </Button>
  );
}
