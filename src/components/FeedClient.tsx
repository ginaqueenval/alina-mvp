"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type Post = {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string | null;
};

function normalizeImageUrl(url: string) {
  if (url.startsWith("http://")  url.startsWith("https://")  url.startsWith("/")) return url;
  return /${url};
}

export default function FeedClient({
  initialPosts,
  initialError,
}: {
  initialPosts: Post[];
  initialError: string | null;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(initialError);

  const captionLen = useMemo(() => caption.trim().length, [caption]);

  // ✅ Realtime: هر INSERT جدید به جدول posts، خودکار میاد بالای فید
  useEffect(() => {
    const channel = supabase
      .channel("realtime:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const newPost = payload.new as Post;

          setPosts((prev) => {
            // جلوگیری از تکراری شدن (مثلاً اگه خودت پست گذاشتی و هم realtime هم insert دستی اضافه کنه)
            if (prev.some((p) => String(p.id) === String(newPost.id))) return prev;
            return [newPost, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function onPost() {
    const text = caption.trim();
    if (!text || text.length > 280) return;

    setLoading(true);
    setErr(null);

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) throw userErr;
      if (!user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          caption: text,
          image_url: null,
        })
        .select("id,user_id,caption,image_url")
        .single();

      if (error) throw error;

      // ✅ Optimistic اضافه کردن (Realtime هم میاد، ولی با چک بالا تکراری نمیشه)
      setPosts((p) => [data as Post, ...p]);
      setCaption("");
    } catch (e: any) {
      setErr(e?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Center */}
        <section className="col-span-12 md:col-span-9">
          {/* Composer */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
              <div className="w-full">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's happening?"
                  className="min-h-[88px] w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/20"
                />

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-zinc-500">
                    {captionLen}/280
                  </p>

                  <button
                    onClick={onPost}
                    disabled={loading  captionLen === 0  captionLen > 280}
                    className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
                  >
                    {loading ? "Posting..." : "Post"}
                  </button>
                </div>

                {err && (
                  <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {err}
                  </p>
                )}
              </div>
              </div>
          </section>

          {/* Feed */}
          <section className="mt-6 space-y-4">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
                No posts yet.
              </div>
            ) : (
              posts.map((p) => (
                <article key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />

                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-zinc-300">
                          <span className="font-semibold text-white">User</span>{" "}
                          <span className="text-zinc-400">({p.user_id.slice(0, 8)}…)</span>
                        </div>
                        <div className="text-xs text-zinc-500">now</div>
                      </div>

                      {p.caption ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{p.caption}</p>
                      ) : null}

                      {p.image_url ? (
                        <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                          <Image
                            src={normalizeImageUrl(p.image_url)}
                            alt="Post image"
                            width={1200}
                            height={800}
                            className="h-auto w-full object-cover"
                          />
                        </div>
                      ) : null}

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
                        <button className="rounded-lg px-2 py-1 hover:bg-white/5 hover:text-zinc-200">
                          Reply
                        </button>
                        <button className="rounded-lg px-2 py-1 hover:bg-white/5 hover:text-zinc-200">
                          Repost
                        </button>
                        <button className="rounded-lg px-2 py-1 hover:bg-white/5 hover:text-zinc-200">
                          Like
                        </button>
                        <button className="rounded-lg px-2 py-1 hover:bg-white/5 hover:text-zinc-200">
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </section>

        {/* Right sidebar */}
        <aside className="hidden md:col-span-3 md:block">
          <div className="sticky top-6 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Search</div>
              <input
                placeholder="Search…"
                className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/20"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Trends</div>
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-xs text-zinc-400">Trending</div>
                  <div className="mt-1 font-semibold text-white">#Alina</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-xs text-zinc-400">Trending</div>
                  <div className="mt-1 font-semibold text-white">#Creators</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Who to follow</div>
              <p className="mt-2 text-xs text-zinc-400">Later we’ll fill this from users table.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}