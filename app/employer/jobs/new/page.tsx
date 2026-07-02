import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwner } from "@/lib/queries/companies";
import JobForm from "@/components/JobForm";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/ui/PageHeader";

export default async function NewJobPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const company = user ? await getCompanyByOwner(supabase, user.id) : null;

  if (!company) {
    return (
      <div>
        <PageHeader title="Post a role" />
        <div className="mt-6">
          <EmptyState
            title="No company yet"
            message="Set up your company profile before posting a role."
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

  return (
    <div>
      <PageHeader
        title="Post a role"
        description="Publishes immediately and appears on Browse for every visitor, unless you save it as a draft."
      />
      <div className="mt-6">
        <JobForm />
      </div>
    </div>
  );
}
