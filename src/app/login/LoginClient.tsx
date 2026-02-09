"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/feed";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push(next);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-white/10 rounded-2xl p-6 bg-white/5">
        <h1 className="text-3xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Use your email & password to access Alina.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Email</label>
            <input
              className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3 py-2 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">Password</label>
            <input
              className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3 py-2 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {err && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-2 font-semibold disabled:opacity-60"
          >
            {loading ? "Loading..." : "Log in"}
          </button>

          <div className="flex justify-between text-sm text-zinc-400 pt-2">
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
