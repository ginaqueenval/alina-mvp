'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/role');
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none"
          />
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
          >
            {loading ? 'Signing up…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-sm text-zinc-400">
          Already have an account?{' '}
          <a href="/login" className="underline">
            Log in
          </a>
        </p>
      </main>
    </>
  );
}
