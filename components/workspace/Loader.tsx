"use client";

export function Loader({ label = "Processing..." }: { label?: string }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/50 backdrop-blur-[2px]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#fcedfd]/35 border-t-[#90119b]" />
      <p className="text-sm text-slate-200">{label}</p>
    </div>
  );
}
