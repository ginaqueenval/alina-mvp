import Navbar from "@/components/Navbar";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

type Post = {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalizeImageUrl(url: string) {
  // اجازه بده هم آدرس کامل باشه هم مسیر لوکال مثل /uploads/...
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) return url;
  return `/${url}`;
}

export default async function FeedPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("id,user_id,caption,image_url")
    .order("id", { ascending: false });

  const posts: Post[] = data ?? [];

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Feed</h1>
          <p className="mt-1 text-sm text-zinc-400">Latest posts from creators.</p>
        </div>

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
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-300">
                    <span className="font-semibold text-white">User</span>{" "}
                    <span className="text-zinc-400">({p.user_id.slice(0, 8)}…)</span>
                  </div>
                </div>

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

                {p.caption ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-200">{p.caption}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
