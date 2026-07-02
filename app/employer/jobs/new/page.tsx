import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwner } from "@/lib/queries/companies";
import JobForm from "@/components/JobForm";
import EmptyState from "@/components/EmptyState";

export default async function NewJobPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const company = user ? await getCompanyByOwner(supabase, user.id) : null;

  if (!company) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">Post a role</h1>
        <div className="mt-6">
          <EmptyState
            title="No company yet"
            message="Set up your company profile before posting a role."
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

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Post a role</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Publishes immediately and appears on Browse for every visitor,
          unless you save it as a draft.
        </p>
      </div>
      <div className="mt-6">
        <JobForm />
      </div>
    </div>
  );
}
