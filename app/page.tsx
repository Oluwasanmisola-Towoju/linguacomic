import { Features } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";
import { Card } from "@/components/ui/card";

const STEPS = ["Upload comic", "Choose language", "Download result"];

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />

      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-5 py-14">
        <h2 className="mb-6 text-2xl font-semibold text-white md:text-3xl">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Card key={step} className="p-6">
              <p className="mb-2 text-xs uppercase tracking-wide text-[#fcedfd]">
                Step {index + 1}
              </p>
              <p className="text-base text-slate-100">{step}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-16 w-full max-w-6xl border-t border-white/10 px-5 py-8 text-sm text-slate-400">
        LingoComic © {new Date().getFullYear()} - Built for comic creators.
      </footer>
    </>
  );
}
