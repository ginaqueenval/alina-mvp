import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import FeedClient from "@/components/FeedClient";

type Post = {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string | null;
};

export default async function FeedPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // اگر لاگین نیستی، برگرد به لاگین
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("posts")
    .select("id,user_id,caption,image_url")
    .order("id", { ascending: false });

  const posts: Post[] = data ?? [];

  return (
    <>
      <Navbar />
      <FeedClient initialPosts={posts} initialError={error?.message ?? null} />
    </>
  );
}
