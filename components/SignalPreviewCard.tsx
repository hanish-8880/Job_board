"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Radio, X } from "lucide-react";
import type { Job } from "@/lib/types";
import { computeSignal } from "@/lib/signal";
import SignalBadge from "./SignalBadge";

/**
 * The hero's visual centerpiece: a real listing's real Signal Score
 * ticking through its checklist, live. Not a mockup — the same
 * lib/signal.ts output shown on that job's own detail page.
 */
export default function SignalPreviewCard({ job }: { job: Job }) {
  const shouldReduceMotion = useReducedMotion();
  const signal = computeSignal(job);
  const visibleChecks = signal.checks.slice(0, 5);

  return (
    <div className="relative">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl border border-border bg-surface p-5 shadow-xl"
      >
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-faint">
          <Radio className="h-3.5 w-3.5 text-primary" aria-hidden />
          Live from this board — not a mockup
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-base font-bold text-primary">
            {job.company.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold text-ink">{job.title}</p>
            <p className="truncate text-sm text-ink-soft">{job.company}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-border pt-4">
          {visibleChecks.map((check, i) => (
            <motion.div
              key={check.id}
              initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.3 }}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  check.passed ? "bg-strong-bg text-strong" : "bg-weak-bg text-weak"
                }`}
              >
                {check.passed ? (
                  <Check className="h-3 w-3" aria-hidden />
                ) : (
                  <X className="h-3 w-3" aria-hidden />
                )}
              </span>
              <span className="text-ink-soft">{check.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <SignalBadge score={signal.score} tier={signal.tier} />
          <Link
            href={`/jobs/${job.id}`}
            className="text-sm font-medium text-primary underline underline-offset-2"
          >
            View listing →
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        className="absolute -right-3 -top-3 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink shadow-md"
      >
        Computed from this listing&apos;s own text
      </motion.div>
    </div>
  );
}
