import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // اگر لاگین نیستی، برگرد لاگین
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top bar (simple) */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/feed" className="text-lg font-semibold tracking-tight">
            Alina
          </Link>

          <nav className="flex items-center gap-4 text-sm text-zinc-300">
            <Link href="/explore" className="hover:text-white">
              Explore
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/setting/profile" className="hover:text-white">
              Profile
            </Link>

            <span className="hidden sm:inline text-xs text-zinc-400">
              {user.email ?? `${user.id.slice(0, 8)}…`}
            </span>

            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6 px-6 py-6">
        {/* Left */}
        <aside className="col-span-12 md:col-span-3">
          <div className="sticky top-[84px] space-y-2">
            <Link
              href="/feed"
              className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
            >
              Explore
            </Link>
            <Link
              href="/u/me"
              className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
            >
              My profile
            </Link>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-400">
              Logged in as:{" "}
              <span className="text-zinc-200">
                {user.email ?? `${user.id.slice(0, 8)}…`}
              </span>
            </div>
          </div>
        </aside>

        {/* Center */}
        <main className="col-span-12 md:col-span-6">{children}</main>

        {/* Right */}
        <aside className="col-span-12 md:col-span-3">
          <div className="sticky top-[84px] space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Trends</div>
              <div className="mt-2 space-y-2 text-sm text-zinc-300">
                <div className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2">
                  #alina
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2">
                  #creators
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2">
                  #updates
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Who to follow</div>
              <p className="mt-2 text-sm text-zinc-400">(بعداً واقعی‌اش می‌کنیم)</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}