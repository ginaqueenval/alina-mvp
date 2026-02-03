import Link from "next/link";
import Navbar from "@/components/Navbar";
import { creators } from "@/lib/mock";

export default function ExplorePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Explore creators</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Discover profiles and preview content. Subscribe to unlock.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              MVP (mock data)
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((c) => (
            <Link
              key={c.username}
              href={`/creator/${c.username}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-xl">
                  {c.avatarEmoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{c.displayName}</div>
                  <div className="truncate text-sm text-zinc-400">@{c.username}</div>
                </div>
                <div className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold">
                  ${c.priceUsd}/mo
                </div>
              </div>
              <p className="mt-4 line-clamp-2 text-sm text-zinc-300">{c.bio}</p>
              <div className="mt-5 text-xs text-zinc-400">View profile →</div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
