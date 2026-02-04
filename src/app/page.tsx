import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              A dark, premium creator platform — built for global audiences.
            </h1>

            <p className="mt-4 text-zinc-300">
              Subscribe to creators, unlock posts, and message directly. Crypto-ready payments are
              supported (MVP UI now, integration later).
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:opacity-90"
              >
                Explore creators
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                View pricing
              </Link>
            </div>

            <p className="mt-6 text-xs text-zinc-400">
              Alina MVP — dark UI, creator profiles, locked content previews, and auth coming next.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-300">Preview</div>

            <div className="mt-4 space-y-3">
              {/* Luna card with real image */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                    🌙
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Luna</div>
                    <div className="text-xs text-zinc-400">@luna • Public post</div>
                  </div>
                  <div className="rounded-lg bg-white/10 px-2 py-1 text-xs text-zinc-200">
                    Subscribe
                  </div>
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <Image
                    src="/uploads/luna-post.jpg"
                    alt="Luna post"
                    width={1200}
                    height={800}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </div>

                <p className="mt-3 text-sm text-zinc-200">
                  I designed this website for a girl im in love with
                </p>
              </div>

              {/* Keep Aria preview as-is */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                    🖤
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Aria</div>
                    <div className="text-xs text-zinc-400">@aria • Public teaser</div>
                  </div>
                  <div className="rounded-lg bg-white/10 px-2 py-1 text-xs text-zinc-200">
                    Follow
                  </div>
                </div>
                <div className="mt-3 h-24 rounded-xl bg-white/10" />
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-400">
              Locked posts appear blurred until you subscribe.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
