import Link from "next/link";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getProfile } from "@/lib/queries/profiles";
import { AI_MODEL } from "@/lib/ai";
import MatchesView from "@/components/MatchesView";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/ui/PageHeader";

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profile, jobs] = await Promise.all([
    getProfile(supabase, user.id),
    getPublishedJobs(supabase),
  ]);

  if (!profile?.resumeText) {
    return (
      <div>
        <PageHeader title="Matches" />
        <div className="mt-6">
          <EmptyState icon={FileText} title="No resume yet" message="Add your resume text first." />
        </div>
        <Link
          href="/dashboard/resume"
          className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-2"
        >
          Add resume →
        </Link>
      </div>
    );
  }

  const jobById = new Map(jobs.map((job) => [job.id, job]));
  const initialResults = (profile.resumeMatchResults ?? [])
    .filter((match) => jobById.has(match.jobId))
    .map((match) => {
      const job = jobById.get(match.jobId)!;
      return {
        jobId: job.id,
        title: job.title,
        company: job.company,
        matchScore: match.matchScore,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div>
      <PageHeader
        title="Matches"
        description="One Gemini call scores your resume against every published role at once — computed on request, not recomputed on every visit."
      />
      <div className="mt-6">
        <MatchesView
          initialResults={initialResults}
          initialComputedAt={profile.resumeMatchComputedAt}
          model={AI_MODEL}
        />
      </div>
    </div>
  );
}
