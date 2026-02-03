import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getPost, getCreator } from "@/lib/mock";

export default function PostPage({ params }: { params: { id: string } }) {
  const post = getPost(params.id);

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <Link href="/explore" className="mt-6 inline-block text-sm underline">
            Back to Explore
          </Link>
        </main>
      </>
    );
  }

  const creator = getCreator(post.creatorUsername);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-400">
            by{" "}
            <Link href={`/creator/${post.creatorUsername}`} className="text-zinc-200 underline">
              @{post.creatorUsername}
            </Link>
          </div>

          <div className="rounded-lg bg-white/10 px-2 py-1 text-xs text-zinc-200">
            {post.isLocked ? "Locked" : "Public"}
          </div>
        </div>

        <h1 className="mt-3 text-2xl font-bold">{post.caption}</h1>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          {post.isLocked ? (
            <>
              <div className="h-64 rounded-xl bg-white/10 blur-[2.5px]" />
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Subscribe to unlock</div>
                <p className="mt-1 text-sm text-zinc-400">
                  This post is locked. Subscribe to {creator?.displayName ?? "the creator"} to view
                  the full content.
                </p>
                <button className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">
                  Subscribe (MVP)
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="h-64 rounded-xl bg-white/10" />
              <p className="mt-4 text-sm text-zinc-300">
                This is a public post in the MVP mock feed.
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
