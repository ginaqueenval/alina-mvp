'use client';

import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function RolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectRole = async (role: 'fan' | 'creator') => {
    setLoading(true);
    setErrorMsg('');

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      setErrorMsg(userError?.message || 'User not found');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', user.id);

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push(role === 'fan' ? '/feed' : '/creator/dashboard');
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-bold">Choose your role</h1>
        <p className="mt-2 text-sm text-zinc-400">Select how you want to use Alina.</p>
        {errorMsg && <p className="mt-4 text-sm text-red-500">{errorMsg}</p>}
        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={() => selectRole('fan')}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-left hover:bg-white/10 disabled:opacity-50"
          >
            <h2 className="text-lg font-semibold">Fan</h2>
            <p className="text-sm text-zinc-400">Follow creators, unlock posts and send tips.</p>
          </button>
          <button
            onClick={() => selectRole('creator')}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-left hover:bg-white/10 disabled:opacity-50"
          >
            <h2 className="text-lg font-semibold">Creator</h2>
            <p className="text-sm text-zinc-400">Share content, build a community and earn.</p>
          </button>
        </div>
      </main>
    </>
  );
}
