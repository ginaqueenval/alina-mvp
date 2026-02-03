import Navbar from "@/components/Navbar";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-bold">Pricing</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Alina supports subscriptions and tips. For MVP, crypto payments are presented as UI flows
          (integration later).
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Fans</div>
            <div className="mt-2 text-xl font-semibold">Subscribe & unlock</div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li>• Explore creators worldwide</li>
              <li>• Unlock locked posts after subscribing</li>
              <li>• Direct messages (MVP)</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Creators</div>
            <div className="mt-2 text-xl font-semibold">Earn from content</div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li>• Post locked or public content</li>
              <li>• Track subscribers & earnings (MVP)</li>
              <li>• Crypto-ready payout flow (later)</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
