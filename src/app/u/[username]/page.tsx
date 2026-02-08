import Navbar from "@/components/Navbar";
import { createClient } from "@supabase/supabase-js";

type Profile = {
  id: string;
  role: string | null;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  updated_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;

  const { data, error } = await supabase
    .from("profiles")
    .select("id,role,full_name,username,bio,avatar_url,updated_at")
    .eq("username", username)
    .maybeSingle();

  const profile = data as Profile | null;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        {error || !profile ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h1 className="text-xl font-semibold">Profile not found</h1>
            <p className="mt-2 text-sm text-zinc-400">
              This profile may be private or the username doesn’t exist.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                {profile.avatar_url ? (
                  // از img استفاده می‌کنیم تا گیر تنظیمات next/image نیفتیم
                  // بعداً اگر خواستی optimize کنیم، می‌بریم روی next/image + remotePatterns
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xl">👤</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {profile.full_name || profile.username}
                  </h1>
                  <span className="text-sm text-zinc-400">@{profile.username}</span>
                  {profile.role ? (
                    <span className="rounded-lg bg-white/10 px-2 py-1 text-xs text-zinc-200">
                      {profile.role}
                    </span>
                  ) : null}
                </div>

                {profile.bio ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-200">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-zinc-400">No bio yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
