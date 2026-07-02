import Link from "next/link";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getApplicationsForCandidate } from "@/lib/queries/applications";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  applied: "neutral",
  reviewing: "moderate",
  accepted: "strong",
  rejected: "weak",
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
      <PageHeader
        title="Applied roles"
        description="Status is set by the employer — this reflects their real record, not an estimate."
      />

      <div className="mt-6 flex flex-col gap-3">
        {applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            message="Apply to a role from its listing page and it'll show up here."
          />
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="text-base font-bold text-ink hover:underline"
                  >
                    {application.job.title}
                  </Link>
                  <p className="text-sm text-ink-soft">{application.job.company}</p>
                </div>
                <Badge variant={STATUS_VARIANT[application.status]}>
                  {application.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-ink-faint">
                Applied {new Date(application.createdAt).toLocaleDateString("en-US")}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
