"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setEmail(data.user?.email ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Alina
        </Link>

        <nav className="flex items-center gap-3 text-sm text-zinc-300">
          <Link href="/explore" className="hover:text-white">
            Explore
          </Link>

          {loading ? (
            <span className="text-zinc-500">…</span>
          ) : email ? (
            <>
              <Link href="/feed" className="hover:text-white">
                Feed
              </Link>
              <Link href="/settings/profile" className="hover:text-white">
                Profile
              </Link>

              <span className="hidden sm:inline text-zinc-500">•</span>
              <span className="hidden sm:inline text-zinc-400">{email}</span>

              <button
                onClick={onLogout}
                className="rounded-xl bg-white/10 px-3 py-2 font-semibold text-white hover:bg-white/15"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
              <Link href="/login" className="hover:text-white">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-white/10 px-3 py-2 font-semibold text-white hover:bg-white/15"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
