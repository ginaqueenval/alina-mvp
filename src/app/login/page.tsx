"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  return createBrowserClient(url, key);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      router.push("/feed");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-3xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Use your email and password to access Alina.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/40 p-6"
        >
          <label className="text-sm text-zinc-300">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-white/20"
            placeholder="you@example.com"
          />

          <label className="mt-4 block text-sm text-zinc-300">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-white/20"
            placeholder="••••••••"
          />

          <button
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-amber-200 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {err && (
            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {err}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between text-sm text-zinc-400">
            <Link className="underline hover:text-zinc-200" href="/forgot-password">
              Forgot your password?
            </Link>
            <Link className="underline hover:text-zinc-200" href="/signup">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
