"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  role: string | null;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
};

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const usernameOk = useMemo(() => {
    if (!username) return false;
    return /^[a-zA-Z0-9_]{3,24}$/.test(username);
  }, [username]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);

      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id,role,full_name,username,bio,avatar_url,is_public")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setErr(error.message);
      } else if (data) {
        setProfile(data as Profile);
        setFullName((data.full_name as string) ?? "");
        setUsername((data.username as string) ?? "");
        setBio((data.bio as string) ?? "");
        setAvatarUrl((data.avatar_url as string) ?? "");
        setIsPublic(Boolean(data.is_public));
      }

      setLoading(false);
    })();
  }, [router]);

  async function onSave() {
    setSaving(true);
    setErr(null);
    setMsg(null);

    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) throw new Error("Not authenticated");

      if (username && !usernameOk) {
        throw new Error("Username must be 3–24 chars and only letters/numbers/_");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName || null,
          username: username || null,
          bio: bio || null,
          avatar_url: avatarUrl || null,
          is_public: isPublic,
        })
        .eq("id", user.id);

      if (error) throw error;

      setMsg("Profile updated.");
    } catch (e: any) {
      setErr(e?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold">Edit profile</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Set a username to enable your public profile page.
        </p>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
            Loading…
          </div>
        ) : (
          <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div>
              <label className="text-sm text-zinc-300">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-white/20"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-white/20"
                placeholder="e.g. luna"
              />
              <p className="mt-2 text-xs text-zinc-400">
                3–24 chars, letters/numbers/_ فقط. {username ? (usernameOk ? "✅" : "❌") : ""}
              </p>
              {usernameOk ? (
                <p className="mt-1 text-xs text-zinc-400">
                  Public URL: <span className="text-zinc-200">/u/{username}</span>
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm text-zinc-300">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-white/20"
                placeholder="Write something…"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Avatar URL</label>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-white/20"
                placeholder="https://..."
              />
              <p className="mt-2 text-xs text-zinc-400">
                فعلاً با URL؛ بعداً آپلود واقعی به Storage اضافه می‌کنیم.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div>
                <div className="text-sm font-semibold">Public profile</div>
                <div className="text-xs text-zinc-400">
                  If disabled, only you can see your profile.
                </div>
              </div>

              <button
                onClick={() => setIsPublic((v) => !v)}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm text-zinc-100 hover:bg-white/15"
              >
                {isPublic ? "Public" : "Private"}
              </button>
            </div>

            <button
              onClick={onSave}
              disabled={saving}
              className="w-full rounded-xl bg-amber-200 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>

            {err ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {err}
              </p>
            ) : null}
            {msg ? (
              <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {msg}
              </p>
            ) : null}
          </div>
        )}
      </main>
    </>
  );
}
