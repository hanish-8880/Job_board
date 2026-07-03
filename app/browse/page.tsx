import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getBookmarkedJobIds } from "@/lib/queries/bookmarks";
import JobListing from "@/components/JobListing";

export default async function BrowsePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/browse");

  const [jobs, bookmarkedIds] = await Promise.all([
    getPublishedJobs(supabase),
    getBookmarkedJobIds(supabase, user.id),
  ]);

  return <JobListing jobs={jobs} bookmarkedIds={bookmarkedIds} />;
}
