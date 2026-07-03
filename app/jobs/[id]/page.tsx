import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Briefcase, DollarSign, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getJobById } from "@/lib/queries/jobs";
import { isBookmarked } from "@/lib/queries/bookmarks";
import { hasApplied } from "@/lib/queries/applications";
import { computeSignal } from "@/lib/signal";
import { detectRedFlags } from "@/lib/redflags";
import SignalBadge from "@/components/SignalBadge";
import SignalBreakdown from "@/components/SignalBreakdown";
import RedFlagBanner from "@/components/RedFlagBanner";
import SaveButton from "@/components/SaveButton";
import ApplyPanel from "@/components/ApplyPanel";
import EmptyState from "@/components/EmptyState";
import Card from "@/components/ui/Card";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/jobs/${id}`);

  const job = await getJobById(supabase, id);

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState
          title="Listing not found"
          message="This role may have been removed, unpublished, or the link is incorrect."
        />
        <div className="mt-6">
          <Link
            href="/browse"
            className="text-sm font-medium text-primary underline underline-offset-2"
          >
            ← Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const [saved, applied] = await Promise.all([
    isBookmarked(supabase, job.id, user.id),
    hasApplied(supabase, job.id, user.id),
  ]);

  const signal = computeSignal(job);
  const flags = detectRedFlags(job);
  const salaryLabel =
    job.salaryMin !== null && job.salaryMax !== null
      ? `${job.currency} ${job.salaryMin.toLocaleString("en-US")}–${job.salaryMax.toLocaleString("en-US")} / year`
      : "Salary not disclosed";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/browse"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Browse
      </Link>

      <Card className="mt-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {job.status === "draft" && (
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-moderate">
                Draft — only visible to you
              </p>
            )}
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-xl font-bold text-primary">
                {job.company.charAt(0).toUpperCase()}
              </span>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  {job.title}
                </h1>
                <p className="mt-1 text-sm text-ink-soft">{job.company}</p>
              </div>
            </div>
          </div>
          <SaveButton jobId={job.id} initialSaved={saved} isLoggedIn />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-ink-faint" aria-hidden />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-ink-faint" aria-hidden />
            {job.mode} · {job.level}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
            <DollarSign className="h-4 w-4 text-ink-faint" aria-hidden />
            {salaryLabel}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SignalBadge score={signal.score} tier={signal.tier} />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-background px-2.5 py-0.5 text-xs text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <ApplyPanel
            jobId={job.id}
            company={job.company}
            isLoggedIn
            initialApplied={applied}
          />
        </div>
      </Card>

      {flags.length > 0 && (
        <div className="mt-6">
          <RedFlagBanner flags={flags} />
        </div>
      )}

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-bold text-ink">About the role</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink-soft">
          {job.description}
        </p>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-bold text-ink">Responsibilities</h2>
        <ul className="mt-2 divide-y divide-border">
          {job.responsibilities.map((item) => (
            <li key={item} className="py-2.5 text-sm text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-bold text-ink">Requirements</h2>
        <ul className="mt-2 divide-y divide-border">
          {job.requirements.map((item) => (
            <li key={item} className="py-2.5 text-sm text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-6 mb-4">
        <SignalBreakdown result={signal} />
      </div>
    </div>
  );
}
