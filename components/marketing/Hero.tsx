import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-[#e6e7ea]/40 bg-[#fdf6fe]/10 px-3 py-1 text-xs uppercase tracking-wider text-[#fcedfd]">
          Comic Localization Studio
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">LingoComic</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
          Translate comics into any language without losing the vibe
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/comic"
            className="rounded-xl bg-[#90119b] px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:opacity-95"
          >
            Try it now
          </Link>
          <a
            href="#how-it-works"
            className="glass-panel rounded-xl border border-[#e6e7ea]/40 px-6 py-3 text-sm font-medium text-slate-100 transition hover:bg-[#fcedfd]/10"
          >
            See demo
          </a>
        </div>
      </div>
    </section>
  );
}
