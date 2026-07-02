import Link from "next/link";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getProfile } from "@/lib/queries/profiles";
import AIReviewForm from "@/components/AIReviewForm";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/ui/PageHeader";

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
        <PageHeader title="AI Resume Review" />
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

  return (
    <div>
      <PageHeader
        title="AI Resume Review"
        description="Pick a role. This calls Google's Gemini 2.5 Flash in real time with your resume text and that job's description — the score is whatever the model actually returns, not a fallback."
      />
      <div className="mt-6">
        <AIReviewForm jobs={jobs.map((job) => ({ id: job.id, title: job.title, company: job.company }))} />
      </div>
    </div>
  );
}
