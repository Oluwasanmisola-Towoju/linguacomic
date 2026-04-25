import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e6e7ea]/20 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          LingoComic
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/#features" className="hover:text-white">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-white">
            How it works
          </Link>
        </nav>
        <Link
          href="/comic"
          className="hidden rounded-xl bg-[#90119b] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95 md:inline-flex"
        >
          Try it now
        </Link>
      </div>
    </header>
  );
}
