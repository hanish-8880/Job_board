import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwner } from "@/lib/queries/companies";
import { getJobsForCompany } from "@/lib/queries/jobs";
import { getApplicationCountForCompany } from "@/lib/queries/applications";
import EmptyState from "@/components/EmptyState";
import StatTile from "@/components/StatTile";

export default async function EmployerHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const company = user ? await getCompanyByOwner(supabase, user.id) : null;

  if (!company) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">Dashboard</h1>
        <div className="mt-6">
          <EmptyState
            title="No company yet"
            message="Set up your company profile to start posting roles."
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

  const [jobs, applicationCount] = await Promise.all([
    getJobsForCompany(supabase, company.id),
    getApplicationCountForCompany(supabase, company.id),
  ]);
  const publishedCount = jobs.filter((job) => job.status === "published").length;

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">{company.name}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Real counts from your own listings — no charts here, since a
          brand-new board has no traffic history yet to chart honestly.
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Published roles" value={publishedCount} />
        <StatTile label="Draft roles" value={jobs.length - publishedCount} />
        <StatTile label="Total applications" value={applicationCount} />
      </div>
    </div>
  );
}
