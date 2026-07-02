import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getApplicationsForCandidate } from "@/lib/queries/applications";
import EmptyState from "@/components/EmptyState";

const STATUS_STYLE: Record<string, string> = {
  applied: "border-ink-faint text-ink-soft",
  reviewing: "border-moderate text-moderate",
  accepted: "border-strong text-strong",
  rejected: "border-weak text-weak",
};

export default async function AppliedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const applications = await getApplicationsForCandidate(supabase, user.id);

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">Applied roles</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Status is set by the employer — this reflects their real record,
          not an estimate.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            message="Apply to a role from its listing page and it'll show up here."
          />
        ) : (
          applications.map((application) => (
            <div key={application.id} className="border border-rule bg-paper-raised px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="font-serif text-lg font-semibold text-ink hover:underline"
                  >
                    {application.job.title}
                  </Link>
                  <p className="text-sm text-ink-soft">{application.job.company}</p>
                </div>
                <span
                  className={`rounded-sm border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] ${
                    STATUS_STYLE[application.status]
                  }`}
                >
                  {application.status}
                </span>
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
                Applied {new Date(application.createdAt).toLocaleDateString("en-US")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
