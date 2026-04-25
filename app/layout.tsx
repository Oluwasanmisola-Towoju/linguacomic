import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Navbar } from "@/components/marketing/Navbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "LingoComic",
  description: "Translate comics into any language without losing the vibe"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Toaster
          richColors
          theme="dark"
          position="top-right"
          toastOptions={{
            className: "glass-panel"
          }}
        />
      </body>
    </html>
  );
}
