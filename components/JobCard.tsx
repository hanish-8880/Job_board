import Link from "next/link";
import type { Job } from "@/lib/types";
import { computeSignal } from "@/lib/signal";
import { detectRedFlags } from "@/lib/redflags";
import SignalBadge from "./SignalBadge";
import RedFlagTag from "./RedFlagTag";
import SaveButton from "./SaveButton";

export default function JobCard({ job }: { job: Job }) {
  const signal = computeSignal(job);
  const flags = detectRedFlags(job);
  const salaryLabel =
    job.salaryMin !== null && job.salaryMax !== null
      ? `${job.currency} ${job.salaryMin.toLocaleString("en-US")}–${job.salaryMax.toLocaleString("en-US")}`
      : "Salary not disclosed";

  return (
    <article className="group relative border border-rule bg-paper-raised px-5 py-5 transition-colors hover:border-rule-strong">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href={`/jobs/${job.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden />
            <h3 className="font-serif text-xl font-semibold text-ink group-hover:underline">
              {job.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-ink-soft">
            {job.company} · {job.location}
          </p>
        </div>
        <SaveButton jobId={job.id} className="relative z-10" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SignalBadge score={signal.score} tier={signal.tier} />
        {flags.length > 0 && <RedFlagTag count={flags.length} />}
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
    </article>
  );
}
