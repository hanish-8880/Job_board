"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Radio, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import { buttonVariants } from "./ui/Button";

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background px-5 py-4">
      <Icon className="h-5 w-5 text-primary" aria-hidden />
      <p className="mt-2 text-3xl font-extrabold tabular-nums text-ink">{value}</p>
      <p className="text-sm text-ink-soft">{label}</p>
    </div>
  );
}

export default function Hero({
  totalJobs,
  strongSignalCount,
  redFlagCount,
}: {
  totalJobs: number;
  strongSignalCount: number;
  redFlagCount: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Radio className="h-3.5 w-3.5" aria-hidden />
            Every listing shows its work
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
            Job listings that don&apos;t hide the fine print.
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            Every role carries a transparent Signal Score and a real-time
            red-flag check, computed from the listing&apos;s own words and
            shown in full on the page. No black boxes, no fake AI.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="#roles" className={buttonVariants({ size: "md" })}>
              Browse roles
            </Link>
            <Link href="/signup" className={buttonVariants({ variant: "secondary", size: "md" })}>
              Post a role
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <StatCard icon={Radio} value={totalJobs} label="Roles listed right now" />
          <StatCard icon={TrendingUp} value={strongSignalCount} label="Rated Strong Signal" />
          <StatCard icon={ShieldCheck} value={redFlagCount} label="Flagged for red flags" />
        </motion.div>
      </div>
    </section>
  );
}
