import Navbar from "@/components/Navbar";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import FeedComposer from "@/components/FeedComposer";

type Post = {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string | null;
  created_at?: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalizeImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) return url;
  return `/${url}`;
}

export default async function FeedPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("id,user_id,caption,image_url,created_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  const posts: Post[] = data ?? [];

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr_320px]">
          {/* Left sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-zinc-400">Navigation</div>
                <nav className="mt-3 space-y-2 text-sm">
                  <a className="block rounded-xl bg-white/10 px-3 py-2 text-white" href="/feed">
                    🏠 Home
                  </a>
                  <a className="block rounded-xl px-3 py-2 text-zinc-300 hover:bg-white/5" href="/explore">
                    🔎 Explore
                  </a>
                  <a className="block rounded-xl px-3 py-2 text-zinc-300 hover:bg-white/5" href="/creator">
                    ⭐ Creator
                  </a>
                  <a className="block rounded-xl px-3 py-2 text-zinc-300 hover:bg-white/5" href="/setting/profile">
                    ⚙️ Settings
                  </a>
                </nav>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Tip</div>
                <p className="mt-2 text-xs text-zinc-400">
                  این صفحه «هوم بعد لاگین» هست. بالا می‌تونی پست بسازی، پایین تایم‌لاین رو می‌بینی.
                </p>
              </div>
            </div>
          </aside>

          {/* Center timeline */}
          <section className="min-w-0">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Home</h1>
              <p className="mt-1 text-sm text-zinc-400">Latest posts from creators.</p>
            </div>

            {/* Composer (client component) */}
            <FeedComposer />

            {/* Timeline */}
            <div className="mt-4">
              {error ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  Failed to load posts: {error.message}
                </div>
              ) : posts.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
                  No posts yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((p) => (
                    <article key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <header className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm">
                            👤
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white">
                              User{" "}
                              <span className="text-zinc-400 font-normal">
                                ({p.user_id.slice(0, 8)}…)
                              </span>
                            </div>
                            <div className="text-xs text-zinc-500">
                              {p.created_at ? new Date(p.created_at).toLocaleString() : "—"}
                            </div>
                          </div>
                        </div>

                        <button className="rounded-xl px-3 py-2 text-xs text-zinc-300 hover:bg-white/5">
                          •••
                        </button>
                      </header>

                      {p.caption ? (
                        <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-200">{p.caption}</p>
                      ) : null}

                      {p.image_url ? (
                        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                          <Image
                            src={normalizeImageUrl(p.image_url)}
                            alt="Post image"
                            width={1200}
                            height={800}
                            className="h-auto w-full object-cover"
                            priority={false}
                          />
                        </div>
                      ) : null}

                      <footer className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                        <div className="flex items-center gap-4">
                          <button className="rounded-lg px-2 py-1 hover:bg-white/5">💬 Reply</button>
                          <button className="rounded-lg px-2 py-1 hover:bg-white/5">🔁 Repost</button>
                          <button className="rounded-lg px-2 py-1 hover:bg-white/5">❤️ Like</button>
                        </div>
                        <button className="rounded-lg px-2 py-1 hover:bg-white/5">🔖 Save</button>
                      </footer>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Trends</div>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="text-zinc-200">#Creators</div>
                    <div className="text-xs text-zinc-500">Recommended</div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="text-zinc-200">#Subscriptions</div>
                    <div className="text-xs text-zinc-500">Popular</div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="text-zinc-200">#NewPosts</div>
                    <div className="text-xs text-zinc-500">Today</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Who to follow</div>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                    <div>
                      <div className="text-zinc-200">Luna</div>
                      <div className="text-xs text-zinc-500">@luna</div>
                    </div>
                    <button className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black">
                      Follow
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                    <div>
                      <div className="text-zinc-200">Aria</div>
                      <div className="text-xs text-zinc-500">@aria</div>
                    </div>
                    <button className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
