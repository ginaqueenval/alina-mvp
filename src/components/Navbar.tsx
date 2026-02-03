import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Alina
        </Link>

        <nav className="flex items-center gap-3 text-sm text-zinc-300">
          <Link href="/explore" className="hover:text-white">
            Explore
          </Link>
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-white">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-white/10 px-3 py-2 font-semibold text-white hover:bg-white/15"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
