import Link from "next/link";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getProfile } from "@/lib/queries/profiles";
import CoverLetterForm from "@/components/CoverLetterForm";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/ui/PageHeader";

export default async function CoverLetterPage() {
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
        <PageHeader title="AI Cover Letter" />
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
        title="AI Cover Letter"
        description="Generates a draft with Google's Gemini 2.5 Flash from your resume text and the selected job. Edit before using — this is a starting point, not a final draft."
      />
      <div className="mt-6">
        <CoverLetterForm
          jobs={jobs.map((job) => ({ id: job.id, title: job.title, company: job.company }))}
        />
      </div>
    </div>
  );
}
