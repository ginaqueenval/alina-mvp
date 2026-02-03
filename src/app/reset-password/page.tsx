'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully. Please log in with your new password.');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-zinc-300">{message}</p>}
      </main>
    </>
  );
}
