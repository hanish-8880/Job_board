import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwner } from "@/lib/queries/companies";
import { getJobsForCompany } from "@/lib/queries/jobs";
import EmptyState from "@/components/EmptyState";
import EmployerJobRow from "@/components/EmployerJobRow";
import { buttonVariants } from "@/components/ui/Button";

export default async function EmployerJobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const company = user ? await getCompanyByOwner(supabase, user.id) : null;

  if (!company) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">My Jobs</h1>
        <div className="mt-6">
          <EmptyState
            title="No company yet"
            message="Create your company profile before posting a role."
          />
        </div>
        <Link
          href="/employer/company"
          className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-2"
        >
          Set up company →
        </Link>
      </div>
    );
  }

  const jobs = await getJobsForCompany(supabase, company.id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">My Jobs</h1>
        <Link href="/employer/jobs/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" aria-hidden />
          Post a Role
        </Link>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
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
