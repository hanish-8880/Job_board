import { createClient } from "@/lib/supabase/server";
import { getBookmarkedJobs } from "@/lib/queries/bookmarks";
import JobCard from "@/components/JobCard";
import EmptyState from "@/components/EmptyState";

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const jobs = await getBookmarkedJobs(supabase, user.id);

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Saved roles</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Saved to your account — visible from any device you log in on.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {jobs.length === 0 ? (
          <EmptyState
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
