import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-bold">404 — Page not found</h1>
        <p className="mt-3 text-sm text-zinc-400">
          The page you’re looking for doesn’t exist.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm underline">
          Go home
        </Link>
      </main>
    </>
  );
}
