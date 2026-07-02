import { createClient } from "@/lib/supabase/server";
import { getJobById } from "@/lib/queries/jobs";
import JobForm from "@/components/JobForm";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/ui/PageHeader";

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
        <PageHeader title="Edit role" />
        <div className="mt-6">
          <EmptyState title="Listing not found" message="This role may have been deleted." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit role" description={job.title} />
      <div className="mt-6">
        <JobForm job={job} />
      </div>
    </div>
  );
}
