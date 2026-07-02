import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwner } from "@/lib/queries/companies";
import { getJobsForCompany } from "@/lib/queries/jobs";
import EmptyState from "@/components/EmptyState";
import EmployerJobRow from "@/components/EmployerJobRow";

export default async function EmployerJobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const company = user ? await getCompanyByOwner(supabase, user.id) : null;

  if (!company) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">My Jobs</h1>
        <div className="mt-6">
          <EmptyState
            title="No company yet"
            message="Create your company profile before posting a role."
          />
        </div>
        <Link
          href="/employer/company"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.1em] text-navy underline"
        >
          Set up company →
        </Link>
      </div>
    );
  }

  const jobs = await getJobsForCompany(supabase, company.id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">My Jobs</h1>
        <Link
          href="/employer/jobs/new"
          className="rounded-sm bg-navy px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:bg-navy-ink"
        >
          Post a Role
        </Link>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {jobs.length === 0 ? (
          <EmptyState
            title="Nothing posted yet"
            message="Post your first role to start receiving applications."
          />
        ) : (
          jobs.map((job) => <EmployerJobRow key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}
