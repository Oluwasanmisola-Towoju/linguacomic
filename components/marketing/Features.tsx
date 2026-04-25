import { Card } from "@/components/ui/card";

const FEATURES = [
  "AI Bubble Detection",
  "Smart Translation (Pidgin, Yoruba, Swahili, etc.)",
  "Auto Text Re-rendering",
  "Download-ready output"
];

export function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-5 py-14">
      <h2 className="mb-6 text-2xl font-semibold text-white md:text-3xl">Features</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {FEATURES.map((feature) => (
          <Card key={feature} className="rounded-2xl p-6">
            <p className="text-base text-slate-100">{feature}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
