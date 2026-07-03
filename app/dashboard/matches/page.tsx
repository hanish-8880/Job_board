import { createClient } from "@/lib/supabase/server";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getProfile } from "@/lib/queries/profiles";
import { getBookmarkedJobIds } from "@/lib/queries/bookmarks";
import { AI_MODEL } from "@/lib/ai";
import { formatPostedLabel } from "@/lib/format";
import MatchesView from "@/components/MatchesView";
import PageHeader from "@/components/ui/PageHeader";

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profile, jobs, bookmarkedIds] = await Promise.all([
    getProfile(supabase, user.id),
    getPublishedJobs(supabase),
    getBookmarkedJobIds(supabase, user.id),
  ]);

  const jobById = new Map(jobs.map((job) => [job.id, job]));
  const stored = profile?.resumeMatchResults;
  const initialResults = (stored?.matches ?? [])
    .filter((match) => jobById.has(match.jobId))
    .map((match) => {
      const job = jobById.get(match.jobId)!;
      return {
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        mode: job.mode,
        level: job.level,
        tags: job.tags,
        postedLabel: formatPostedLabel(job.postedAt),
        matchScore: match.matchScore,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div>
      <PageHeader
        title="Matches"
        description="Upload or paste your resume once. One Gemini call returns an ATS score and scores every published role at once — computed on request, not recomputed on every visit."
      />
      <div className="mt-6">
        <MatchesView
          initialResumeText={profile?.resumeText ?? ""}
          initialAtsScore={stored?.atsScore ?? null}
          initialResults={initialResults}
          initialComputedAt={profile?.resumeMatchComputedAt ?? null}
          initialBookmarkedIds={bookmarkedIds}
          model={AI_MODEL}
        />
      </div>
    </div>
  );
}
