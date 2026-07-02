import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getProfile } from "@/lib/queries/profiles";
import AIReviewForm from "@/components/AIReviewForm";
import EmptyState from "@/components/EmptyState";

export default async function AIReviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [jobs, profile] = await Promise.all([
    getPublishedJobs(supabase),
    getProfile(supabase, user.id),
  ]);

  if (!profile?.resumeText) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">AI Resume Review</h1>
        <div className="mt-6">
          <EmptyState title="No resume yet" message="Add your resume text first." />
        </div>
        <Link
          href="/dashboard/resume"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.1em] text-navy underline"
        >
          Add resume →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">AI Resume Review</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Pick a role. This calls Google&apos;s Gemini 2.5 Flash in real time with
          your resume text and that job&apos;s description — the score is
          whatever the model actually returns, not a fallback.
        </p>
      </div>
      <div className="mt-6">
        <AIReviewForm jobs={jobs.map((job) => ({ id: job.id, title: job.title, company: job.company }))} />
      </div>
    </div>
  );
}
