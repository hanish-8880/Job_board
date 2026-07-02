import { createClient } from "@/lib/supabase/server";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getBookmarkedJobIds } from "@/lib/queries/bookmarks";
import BrowseJobs from "@/components/BrowseJobs";

export default async function Home() {
  const supabase = await createClient();
  const [{ data: userData }, jobs] = await Promise.all([
    supabase.auth.getUser(),
    getPublishedJobs(supabase),
  ]);

  const user = userData.user;
  const bookmarkedIds = user ? await getBookmarkedJobIds(supabase, user.id) : [];

  return <BrowseJobs jobs={jobs} bookmarkedIds={bookmarkedIds} isLoggedIn={!!user} />;
}
