"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Radio,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { Job } from "@/lib/types";
import { computeSignal, SIGNAL_TIER_LABEL } from "@/lib/signal";
import { detectRedFlags } from "@/lib/redflags";
import { buttonVariants } from "./ui/Button";
import MatchScoreRing from "./MatchScoreRing";
import SignalPreviewCard from "./SignalPreviewCard";

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <p className="text-2xl font-extrabold leading-none tabular-nums text-ink">{value}</p>
        <p className="mt-1 text-xs text-ink-soft">{label}</p>
      </div>
    </div>
  );
}

function FloatingCallout({
  icon,
  eyebrow,
  label,
  delay,
  className = "",
}: {
  icon: ReactNode;
  eyebrow: string;
  label: string;
  delay: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-xl ${className}`}
    >
      {icon}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
          {eyebrow}
        </p>
        <p className="whitespace-nowrap text-sm font-bold text-ink">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Hero({
  totalJobs,
  strongSignalCount,
  redFlagCount,
  previewJob,
}: {
  totalJobs: number;
  strongSignalCount: number;
  redFlagCount: number;
  previewJob: Job | null;
}) {
  const shouldReduceMotion = useReducedMotion();
  const previewSignal = previewJob ? computeSignal(previewJob) : null;
  const previewFlags = previewJob ? detectRedFlags(previewJob) : [];

  return (
    <section className="border-b border-border bg-gradient-to-br from-primary-soft via-surface to-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div
          className={
            previewJob
              ? "grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
              : ""
          }
        >
          <div>
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                Every listing scored. Every flag explained.
              </span>

              <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
                Job listings that don&apos;t hide the{" "}
                <span className="text-primary">fine print</span>.
              </h1>
              <p className="mt-5 text-lg text-ink-soft">
                Every role carries a transparent Signal Score and a real-time
                red-flag check, computed from the listing&apos;s own words and
                shown in full on the page. No black boxes, no fake AI.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
                >
                  Browse roles
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/signup" className={buttonVariants({ variant: "secondary", size: "md", className: "rounded-full px-6 py-3.5" })}>
                  Post a role
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5"
            >
              <StatItem icon={Radio} value={totalJobs} label="Roles listed right now" />
              <div className="hidden h-10 w-px bg-border sm:block" aria-hidden />
              <StatItem icon={TrendingUp} value={strongSignalCount} label="Rated Strong Signal" />
              <div className="hidden h-10 w-px bg-border sm:block" aria-hidden />
              <StatItem icon={ShieldCheck} value={redFlagCount} label="Flagged for red flags" />
            </motion.div>
          </div>

          {previewJob && previewSignal && (
            <div className="relative mx-auto w-full max-w-sm px-2 pb-10 pt-12 lg:mx-0 lg:px-6">
              <SignalPreviewCard job={previewJob} />

              <div className="absolute -top-2 right-2 lg:-right-6">
                <FloatingCallout
                  delay={0.35}
                  eyebrow="Signal Score"
                  label={SIGNAL_TIER_LABEL[previewSignal.tier]}
                  icon={<MatchScoreRing score={previewSignal.score} />}
                />
              </div>

              <div className="absolute -bottom-8 left-2 hidden sm:block lg:-left-6">
                <FloatingCallout
                  delay={0.5}
                  eyebrow="Red-flag check"
                  label={
                    previewFlags.length > 0
                      ? `${previewFlags.length} flag${previewFlags.length === 1 ? "" : "s"} found`
                      : "Nothing flagged"
                  }
                  icon={
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        previewFlags.length > 0 ? "bg-weak-bg text-weak" : "bg-strong-bg text-strong"
                      }`}
                    >
                      {previewFlags.length > 0 ? (
                        <AlertTriangle className="h-4 w-4" aria-hidden />
                      ) : (
                        <ShieldCheck className="h-4 w-4" aria-hidden />
                      )}
                    </span>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
