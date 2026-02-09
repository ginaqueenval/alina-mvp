"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type Post = {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string | null;
};

function normalizeImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))
    return url;
  return `/${url}`;
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

  async function onPost() {
    const text = caption.trim();
    if (!text) return;

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

      setPosts((p) => [data as Post, ...p]);
      setCaption("");
    } catch (e: any) {
      setErr(e?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
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
                {caption.trim().length}/280
              </p>

              <button
                onClick={onPost}
                disabled={loading || caption.trim().length === 0 || caption.trim().length > 280}
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
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/10" />
                <div className="text-sm text-zinc-300">
                  <span className="font-semibold text-white">User</span>{" "}
                  <span className="text-zinc-400">({p.user_id.slice(0, 8)}…)</span>
                </div>
              </div>

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
                  />
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
