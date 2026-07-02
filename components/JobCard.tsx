"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, DollarSign, MapPin } from "lucide-react";
import type { Job } from "@/lib/types";
import { computeSignal } from "@/lib/signal";
import { detectRedFlags } from "@/lib/redflags";
import SignalBadge from "./SignalBadge";
import RedFlagTag from "./RedFlagTag";
import SaveButton from "./SaveButton";

export default function JobCard({
  job,
  initialSaved,
  isLoggedIn,
}: {
  job: Job;
  initialSaved: boolean;
  isLoggedIn: boolean;
}) {
  const signal = computeSignal(job);
  const flags = detectRedFlags(job);
  const shouldReduceMotion = useReducedMotion();
  const salaryLabel =
    job.salaryMin !== null && job.salaryMax !== null
      ? `${job.currency} ${job.salaryMin.toLocaleString("en-US")}–${job.salaryMax.toLocaleString("en-US")}`
      : "Salary not disclosed";

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.15 }}
      className="group relative rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-lg font-bold text-primary">
          {job.company.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <Link href={`/jobs/${job.id}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden />
                <h3 className="text-lg font-bold text-ink group-hover:text-primary">
                  {job.title}
                </h3>
              </Link>
              <p className="mt-0.5 text-sm text-ink-soft">{job.company}</p>
            </div>
            <SaveButton
              jobId={job.id}
              initialSaved={initialSaved}
              isLoggedIn={isLoggedIn}
              className="relative z-10 shrink-0"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
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

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SignalBadge score={signal.score} tier={signal.tier} />
            {flags.length > 0 && <RedFlagTag count={flags.length} />}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-background px-2.5 py-0.5 text-xs text-ink-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
