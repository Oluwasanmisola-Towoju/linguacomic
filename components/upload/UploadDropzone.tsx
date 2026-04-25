"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadDropzoneProps {
  onFileAccepted: (file: File) => void;
  onClearFile: () => void;
  file: File | null;
  previewUrl: string | null;
  disabled?: boolean;
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadDropzone({
  onFileAccepted,
  onClearFile,
  file,
  previewUrl,
  disabled = false
}: UploadDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const [file] = accepted;
      if (file) {
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    disabled,
    noClick: true,
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"]
    }
  });

  return (
    <Card className="rounded-2xl border border-[#e6e7ea]/20 bg-white/[0.03] p-4 sm:p-5">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white">Upload Thumbnail</h3>
        <p className="text-sm text-slate-300">
          Please upload file in jpeg or png format and make sure the file size is under 25 MB.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`mt-4 rounded-xl border border-dashed p-4 transition ${
          isDragActive
            ? "border-[#c66ad0] bg-[#90119b]/20 shadow-glow"
            : "border-[#90119b]/70 bg-[#fdf6fe]/10"
        }`}
      >
        <input {...getInputProps()} aria-label="Upload comic image" />

        {file && previewUrl ? (
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Uploaded comic preview"
              className="h-36 w-full rounded-lg object-cover sm:h-40"
            />
            <div className="hidden shrink-0 flex-col gap-2 sm:flex">
              <button
                type="button"
                onClick={open}
                disabled={disabled}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6e7ea] bg-white/90 text-sm text-[#90119b] transition hover:bg-white"
                aria-label="Replace file"
              >
                R
              </button>
              <button
                type="button"
                onClick={onClearFile}
                disabled={disabled}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6e7ea] bg-white/90 text-sm text-[#d13b4f] transition hover:bg-white"
                aria-label="Remove file"
              >
                X
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-7 text-center">
            <p className="text-lg text-[#f6d9fa]">^</p>
            <p className="text-base font-medium text-white">Drop file or browse</p>
            <p className="text-sm text-slate-300">Format: .jpeg, .png & Max file size: 25 MB</p>
            <Button
              className="mt-2 rounded-lg bg-[#90119b] px-4 py-1.5 text-sm hover:bg-[#7d1088]"
              onClick={open}
              disabled={disabled}
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          className="w-1/2 border border-[#e6e7ea] bg-white/5 text-slate-200 hover:bg-white/10"
          onClick={onClearFile}
          disabled={!file || disabled}
        >
          Cancel
        </Button>
        <div className="w-1/2">
          <Button className="w-full rounded-lg bg-[#90119b] hover:bg-[#7d1088]" disabled={!file}>
            Done
          </Button>
        </div>
      </div>
      {file ? (
        <p className="mt-2 text-xs text-slate-300">
          {file.name} ({formatBytes(file.size)})
        </p>
      ) : null}
    </Card>
  );
}
