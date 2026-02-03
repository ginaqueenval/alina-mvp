import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCreator, posts } from "@/lib/mock";

export default function CreatorProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const creator = getCreator(params.username);

  if (!creator) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-2xl font-bold">Creator not found</h2>
          <p className="mt-2 text-sm text-zinc-400">
            The creator you’re looking for doesn’t exist in the MVP mock data.
          </p>
          <Link href="/explore" className="mt-6 inline-block text-sm underline">
            Back to Explore
          </Link>
        </main>
      </>
    );
  }

  const creatorPosts = posts.filter((p) => p.creatorUsername === creator.username);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-2xl">
              {creator.avatarEmoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl font-bold">{creator.displayName}</div>
              <div className="text-sm text-zinc-400">@{creator.username}</div>
              <p className="mt-3 max-w-2xl text-sm text-zinc-300">{creator.bio}</p>
            </div>

            <div className="text-right">
              <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">
                Subscribe • ${creator.priceUsd}/mo
              </div>
              <div className="mt-2 text-xs text-zinc-400">
                (MVP button — payment UI later)
              </div>
            </div>
          </div>
        </div>

        <h3 className="mt-10 text-lg font-semibold">Posts</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creatorPosts.map((p) => (
            <Link
              key={p.id}
              href={`/post/${p.id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{p.createdAt}</span>
                <span className="rounded-lg bg-white/10 px-2 py-1">
                  {p.isLocked ? "Locked" : "Public"}
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-200">{p.caption}</p>

              <div className={`mt-4 h-28 rounded-xl bg-white/10 ${p.isLocked ? "blur-[2px]" : ""}`} />

              <div className="mt-4 text-xs text-zinc-400">Open →</div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
