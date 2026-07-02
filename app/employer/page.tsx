import Link from "next/link";
import { Briefcase, FileEdit, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwner } from "@/lib/queries/companies";
import { getJobsForCompany } from "@/lib/queries/jobs";
import { getApplicationCountForCompany } from "@/lib/queries/applications";
import EmptyState from "@/components/EmptyState";
import StatTile from "@/components/StatTile";
import PageHeader from "@/components/ui/PageHeader";

export default async function EmployerHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const company = user ? await getCompanyByOwner(supabase, user.id) : null;

  if (!company) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <div className="mt-6">
          <EmptyState
            title="No company yet"
            message="Set up your company profile to start posting roles."
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

  const [jobs, applicationCount] = await Promise.all([
    getJobsForCompany(supabase, company.id),
    getApplicationCountForCompany(supabase, company.id),
  ]);
  const publishedCount = jobs.filter((job) => job.status === "published").length;

  return (
    <div>
      <PageHeader
        title={company.name}
        description="Real counts from your own listings — no charts here, since a brand-new board has no traffic history yet to chart honestly."
      />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile icon={Briefcase} label="Published roles" value={publishedCount} />
        <StatTile icon={FileEdit} label="Draft roles" value={jobs.length - publishedCount} />
        <StatTile icon={Users} label="Total applications" value={applicationCount} />
      </div>
    </div>
  );
}
