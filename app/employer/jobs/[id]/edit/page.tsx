import { createClient } from "@/lib/supabase/server";
import { getJobById } from "@/lib/queries/jobs";
import JobForm from "@/components/JobForm";
import EmptyState from "@/components/EmptyState";

export default async function EditJobPage({
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
        <h1 className="font-serif text-3xl font-semibold text-ink">Edit role</h1>
        <div className="mt-6">
          <EmptyState title="Listing not found" message="This role may have been deleted." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Edit role</h1>
        <p className="mt-2 text-sm text-ink-soft">{job.title}</p>
      </div>
      <div className="mt-6">
        <JobForm job={job} />
      </div>
    </div>
  );
}
