import { Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBookmarkedJobs } from "@/lib/queries/bookmarks";
import JobCard from "@/components/JobCard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/ui/PageHeader";

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const jobs = await getBookmarkedJobs(supabase, user.id);

  return (
    <div>
      <PageHeader
        title="Saved roles"
        description="Saved to your account — visible from any device you log in on."
      />

      <div className="mt-6 flex flex-col gap-4">
        {jobs.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            message="Save a role from Browse and it'll show up here."
          />
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} initialSaved isLoggedIn />
          ))
        )}
      </div>
    </div>
  );
}
