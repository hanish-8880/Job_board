"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  EMPTY_JOBS,
  getPostedJobsSnapshot,
  mergeWithSeedJobs,
  subscribePostedJobs,
} from "@/lib/storage";
import { computeSignal } from "@/lib/signal";
import { detectRedFlags } from "@/lib/redflags";
import SignalBadge from "@/components/SignalBadge";
import SignalBreakdown from "@/components/SignalBreakdown";
import RedFlagBanner from "@/components/RedFlagBanner";
import SaveButton from "@/components/SaveButton";
import ApplyPanel from "@/components/ApplyPanel";
import EmptyState from "@/components/EmptyState";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const postedJobs = useSyncExternalStore(
    subscribePostedJobs,
    getPostedJobsSnapshot,
    () => EMPTY_JOBS
  );
  const allJobs = useMemo(() => mergeWithSeedJobs(postedJobs), [postedJobs]);
  const job = allJobs.find((candidate) => candidate.id === params.id);

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState
          title="Listing not found"
          message="This role may have been removed, or the link is incorrect."
        />
        <div className="mt-6">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.1em] text-navy underline"
          >
            ← Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const signal = computeSignal(job);
  const flags = detectRedFlags(job);
  const salaryLabel =
    job.salaryMin !== null && job.salaryMax !== null
      ? `${job.currency} ${job.salaryMin.toLocaleString("en-US")}–${job.salaryMax.toLocaleString("en-US")} / year`
      : "Salary not disclosed";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.1em] text-ink-faint hover:text-navy"
      >
        ← Back to Browse
      </Link>

      <div className="mt-4 border-b border-rule pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink">
              {job.title}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {job.company} · {job.location}
            </p>
          </div>
          <SaveButton jobId={job.id} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SignalBadge score={signal.score} tier={signal.tier} />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
            {job.mode} · {job.level}
          </span>
        </div>

        <p className="mt-3 font-mono text-sm tabular-nums text-ink-soft">
          {salaryLabel}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {job.tags.map((tag) => (
            <span key={tag} className="font-mono text-xs text-ink-faint">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <ApplyPanel jobId={job.id} company={job.company} />
        </div>
      </div>

      {flags.length > 0 && (
        <div className="mt-6">
          <RedFlagBanner flags={flags} />
        </div>
      )}

      <section className="mt-6">
        <h2 className="font-serif text-lg font-semibold text-ink">About the role</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink-soft">
          {job.description}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-lg font-semibold text-ink">
          Responsibilities
        </h2>
        <ul className="mt-2 divide-y divide-rule border-y border-rule">
          {job.responsibilities.map((item) => (
            <li key={item} className="py-2 text-sm text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-lg font-semibold text-ink">Requirements</h2>
        <ul className="mt-2 divide-y divide-rule border-y border-rule">
          {job.requirements.map((item) => (
            <li key={item} className="py-2 text-sm text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 mb-4">
        <SignalBreakdown result={signal} />
      </section>
    </div>
  );
}
