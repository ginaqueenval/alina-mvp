'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset link sent! Check your email.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-zinc-300">{message}</p>}
      </main>
    </>
  );
}
