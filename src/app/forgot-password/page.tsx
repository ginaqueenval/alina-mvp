"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) throw error;

      setMsg("Check your email for the reset link.");
      setTimeout(() => router.push("/login"), 1200);
    } catch (e: any) {
      setErr(e?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-3xl font-semibold">Forgot password</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your email and we’ll send you a password reset link.
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

          <button
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-amber-200 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          {err && (
            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {err}
            </p>
          )}
          {msg && (
            <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {msg}
            </p>
          )}

          <div className="mt-5 text-sm text-zinc-400">
            <Link className="underline hover:text-zinc-200" href="/login">
              Back to Log in
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
