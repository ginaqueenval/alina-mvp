"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseclient";

export default function FeedComposer() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const canPost = useMemo(() => {
    const hasCaption = caption.trim().length > 0;
    const hasImage = imageUrl.trim().length > 0;
    return (hasCaption || hasImage) && !loading;
  }, [caption, imageUrl, loading]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsLoggedIn(!!data.session);
      setReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function submitPost() {
    setErr(null);
    setOk(null);

    if (!canPost) return;

    setLoading(true);
    try {
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const userId = userRes.user?.id;
      if (!userId) {
        throw new Error("You must be logged in to post.");
      }

      const payload: any = {
        user_id: userId,
        caption: caption.trim() ? caption.trim() : null,
        image_url: imageUrl.trim() ? imageUrl.trim() : null,
      };

      const { error } = await supabase.from("posts").insert(payload);
      if (error) throw error;

      setCaption("");
      setImageUrl("");
      setOk("Posted!");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to post");
    } finally {
      setLoading(false);
      setTimeout(() => setOk(null), 1500);
    }
  }

  if (!ready) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-300">
        Loading…
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-white">Log in to post</div>
        <p className="mt-1 text-sm text-zinc-400">
          برای اینکه این صفحه دقیقاً مثل “هوم بعد لاگین” بشه، ساخت پست فقط برای کاربران لاگین فعال می‌شه.
        </p>
        <button
          onClick={() => router.push("/login?next=/feed")}
          className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm">
          👤
        </div>

        <div className="min-w-0 flex-1">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What’s happening?"
            className="min-h-[90px] w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/20"
          />

          <div className="mt-3">
            <label className="text-xs text-zinc-400">Image URL (optional)</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... or /uploads/..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/20"
            />
          </div>

          {(err || ok) && (
            <div className="mt-3">
              {err ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {err}
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {ok}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              Tip: caption یا image_url یکی‌ش کافیست.
            </div>

            <button
              onClick={submitPost}
              disabled={!canPost}
              className="rounded-xl bg-amber-200 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-60"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
