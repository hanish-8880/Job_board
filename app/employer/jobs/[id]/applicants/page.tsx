import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getJobById } from "@/lib/queries/jobs";
import { getApplicantsForJob } from "@/lib/queries/applications";
import EmptyState from "@/components/EmptyState";
import ApplicantRow from "@/components/ApplicantRow";

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const job = await getJobById(supabase, id);

  if (!job) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">Applicants</h1>
        <div className="mt-6">
          <EmptyState title="Listing not found" message="This role may have been deleted." />
        </div>
      </div>
    );
  }

  const applicants = await getApplicantsForJob(supabase, job.id);

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Applicants</h1>
        <p className="mt-2 text-sm text-ink-soft">
          For{" "}
          <Link href={`/jobs/${job.id}`} className="text-navy underline">
            {job.title}
          </Link>
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {applicants.length === 0 ? (
          <EmptyState
            title="No applicants yet"
            message="Applications will show up here as candidates apply."
          />
        ) : (
          applicants.map((applicant) => (
            <ApplicantRow key={applicant.id} applicant={applicant} jobId={job.id} />
          ))
        )}
      </div>
    </div>
  );
}
